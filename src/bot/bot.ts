import { Client, Intents, Message, VoiceState } from 'discord.js';
import logger from '../logger';
import BotContext from './bot-context';
import CommandMessage from './command-message';
import commands, { helpCommand } from './commands';
import constants from './constants';
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } from '@discordjs/voice';

export default class Bot {
  private client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES],
    presence: { activities: [{ name: 'you', type: 'WATCHING' }] }
  });
  private context = new BotContext();
  private soundPlaying = false;

  constructor() {
    this.client.on('ready', () => this.onReady());
    this.client.on('message', m => this.onMessage(m));
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
  }

  private async onMessage(message: Message) {
    const messageContent = message.content.toLowerCase();

    if (!messageContent.startsWith(constants.messagePrefix))
      return;

    if (messageContent === constants.messagePrefix)
      return helpCommand.execute(message);

    logger.info('%s: Received potential command "%s" from "%s"', message.id, message.content, message.author.username);

    const commandMessage = Bot.splitMessageContent(messageContent);
    const command = commands.find(x => x.name === commandMessage.command);

    if (!command) {
      logger.info('%s: Command "%s" did not match any available commands', message.id, message.content);
      return message.reply(`I didn't recognise that command, try "${ constants.messagePrefix } help".`);
    }

    if (await command.isValid(message))
      await command.execute(message, commandMessage, this.context);
  }

  private onVoiceStateUpdate(oldState: VoiceState) {
    if (oldState.channel && oldState.channel.members.every(x => x.id === this.client.user.id)) {
      this.context.soundQueue.clear();
      oldState.disconnect();
    }
  }

  private async onSoundQueuePush() {
    if (this.soundPlaying)
      return;

    this.soundPlaying = true;

    while (this.context.soundQueue.length) {
      const current = this.context.soundQueue.shift();
      const connection = joinVoiceChannel({
        channelId: current.channel.id,
        guildId: current.channel.guild.id,
        adapterCreator: current.channel.guild.voiceAdapterCreator,
        selfDeaf: false
      });

      logger.info('Playing sound "%s", %s sounds in the queue.', current.sound.name, this.context.soundQueue.length);

      const soundFileName = constants.soundsDirectory + current.sound.fullName;

      logger.debug('Attempting to play file %s', soundFileName);

      const player = createAudioPlayer();
      const resource = createAudioResource(soundFileName);

      connection.subscribe(player);
      player.play(resource);

      await new Promise(resolve => player.on(AudioPlayerStatus.Idle, resolve));
    }

    this.soundPlaying = false;
  }

  private static splitMessageContent(messageContent: string): CommandMessage {
    // [0] is the prefix, throw it away.
    const splitMessage = messageContent.split(' ').slice(1);

    return {
      command: splitMessage[0],
      arguments: splitMessage.slice(1).join(' ')
    };
  }
}
