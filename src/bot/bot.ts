import { Client, Intents, Interaction, VoiceState } from 'discord.js';
import { joinVoiceChannel } from '@discordjs/voice';
import logger from '../logger';
import BotContext from './bot-context';
import commands from './commands';
import constants from './constants';

export default class Bot {
  private client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES],
    presence: { activities: [{ name: 'you', type: 'WATCHING' }] },
  });

  private context = new BotContext();

  private soundPlaying = false;

  constructor() {
    this.client.on('ready', () => this.onReady());
    this.client.on('interactionCreate', interaction => this.onInteraction(interaction));
    this.client.on('warn', m => {
      logger.log('warn', m);
    });
    this.client.on('error', m => {
      logger.log('error', m);
    });
    this.client.on('voiceStateUpdate', oldState => this.onVoiceStateUpdate(oldState));

    this.context.soundQueue.onPush(() => this.onSoundQueuePush());
  }

  start(token: string): Promise<string> {
    logger.info('Starting bot, attempting to log in to Discord');
    return this.client.login(token);
  }

  private onReady() {
    logger.info('Logged in as %s', this.client.user.tag);

    commands.forEach(command => {
      this.client.application.commands.create(command.commandData);
    });
  }

  private async onInteraction(interaction: Interaction) {
    if (!interaction.isCommand())
      return;

    logger.info('%s: Received command "%s" from "%s"', interaction.id, interaction.commandName, interaction.user.username);

    const command = commands.find(x => x.commandData.name === interaction.commandName);

    if (!command) {
      logger.error('%s: Command "%s" did not match any available commands', interaction.id, interaction.commandName);
      return;
    }

    if (await command.isValid(interaction))
      await command.execute(interaction, this.context);
  }

  private onVoiceStateUpdate(oldState: VoiceState) {
    if (oldState.channel?.members.every(x => x.id === this.client.user.id)) {
      this.context.soundQueue.removeByChannel(oldState.channelId);
      if (this.context.currentSound?.channel === oldState.channel) this.context.botAudioPlayer.stop();
      if (!this.context.soundQueue.length) oldState.guild.me.voice.disconnect();
    }
  }

  private async onSoundQueuePush() {
    if (this.soundPlaying)
      return;

    this.soundPlaying = true;

    while (this.context.soundQueue.length) {
      const current = this.context.soundQueue.takeNext();
      this.context.currentSound = current;
      const connection = joinVoiceChannel({
        channelId: current.channel.id,
        guildId: current.channel.guild.id,
        adapterCreator: current.channel.guild.voiceAdapterCreator,
        selfDeaf: false,
      });

      this.context.botAudioPlayer.subscribe(connection);
      logger.info('Playing sound "%s", %s sounds in the queue.', current.sound.name, this.context.soundQueue.length);

      const soundFileName = constants.soundsDirectory + current.sound.fullName;
      // eslint-disable-next-line no-await-in-loop
      await this.context.botAudioPlayer.play(soundFileName);
      this.context.currentSound = null;
    }

    this.soundPlaying = false;
  }
}
