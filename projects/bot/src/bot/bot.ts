import { Client, Intents, Interaction, VoiceState } from 'discord.js';
import { DiscordGatewayAdapterCreator, joinVoiceChannel } from '@discordjs/voice';
import { ReadOnlySoundsService } from 'botman-sounds';
import logger from '../logger';
import BotContext from './bot-context';
import commands from './commands';
import constants from './constants';
import SoundRequestServer from './ui-server';
import Environment from '../environment';

export default class Bot {
  private readonly client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES],
    presence: { activities: [{ name: 'you', type: 'WATCHING' }] },
  });

  private readonly context: BotContext;
  private readonly soundRequestServer: SoundRequestServer;

  private soundPlaying = false;

  constructor(private readonly environment: Environment) {
    this.client.on('ready', () => this.onReady());
    this.client.on('interactionCreate', interaction => this.onInteraction(interaction));
    this.client.on('warn', m => {
      logger.log('warn', m);
    });

    this.client.on('error', m => {
      logger.log('error', m);
    });

    this.client.on('voiceStateUpdate', oldState => this.onVoiceStateUpdate(oldState));

    const soundsService = new ReadOnlySoundsService(environment.soundsConnectionString);
    this.context = new BotContext(soundsService);
    this.context.soundQueue.onPush(() => this.onSoundQueuePush());

    this.soundRequestServer = new SoundRequestServer(80, environment);

    this.soundRequestServer.onSoundRequest((userID, soundRequest) => this.onServerSoundRequest(userID, soundRequest));
    this.soundRequestServer.onSkipRequest((userID, skipAll) => this.onServerSkipRequest(userID, skipAll));
  }

  start(): Promise<string> {
    logger.info('Starting bot, attempting to log in to Discord');
    return this.client.login(this.environment.botToken);
  }

  private onReady() {
    logger.info('Logged in as %s', this.client.user?.tag);

    commands.forEach(command => {
      this.client.application!.commands.create(command.commandData);
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
    if (oldState.channel?.members.every(x => x.id === this.client.user!.id)) {
      this.context.soundQueue.removeByChannel(oldState.channelId!);
      if (this.context.currentSound?.channel === oldState.channel) this.context.botAudioPlayer.stop();
      if (!this.context.soundQueue.length) oldState.guild.me?.voice.disconnect();
    }
  }

  private async onSoundQueuePush() {
    if (this.soundPlaying)
      return;

    this.soundPlaying = true;

    while (this.context.soundQueue.length) {
      const current = this.context.soundQueue.takeNext()!;
      this.context.currentSound = current;
      const connection = joinVoiceChannel({
        channelId: current.channel.id,
        guildId: current.channel.guild.id,
        adapterCreator: current.channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
        selfDeaf: false,
      });

      this.context.botAudioPlayer.subscribe(connection);
      logger.info('Playing sound "%s", %s sounds in the queue.', current.sound.name, this.context.soundQueue.length);

      const soundFileName = constants.soundsDirectory + current.sound.file.fullName;
      // eslint-disable-next-line no-await-in-loop
      await this.context.botAudioPlayer.play(soundFileName);
      this.context.currentSound = undefined;
    }

    this.soundPlaying = false;
  }

  private async onServerSoundRequest(userID: string, soundRequest: string) {
    const soundBoardUser = (await this.client.guilds.fetch(this.environment.homeGuildId)).voiceStates.cache.find(x => x.id === userID);

    if (!soundBoardUser?.channel) {
      logger.info('Sound request received but user is not connected');
      return;
    }

    const sound = await this.context.soundsService.getSound(soundRequest);

    if (!sound) {
      logger.error('Couldn\'t find sound "%s"', soundRequest);
      return;
    }

    this.context.soundQueue.add({ sound, channel: soundBoardUser.channel });
    logger.info(`Server sound request. User: ${ userID }. Queue length: ${ this.context.soundQueue.length }.`);
  }

  private async onServerSkipRequest(userID: string, skipAll: boolean) {
    const soundBoardUser = (await this.client.guilds.fetch(this.environment.homeGuildId)).voiceStates.cache.find(x => x.id === userID);
    if (!soundBoardUser?.channel) {
      logger.info('Skip request received but user is not connected');
      return;
    }
    if (skipAll) this.context.soundQueue.clear();
    this.context.botAudioPlayer.stop();
  }
}
