import { Client, Message, VoiceState } from 'discord.js';
import logger from '../logger';
import BotContext from './bot-context';
import CommandMessage from './command-message';
import commands, { helpCommand } from './commands';
import constants from './constants';

export default class Bot {
  private client: Client;
  private context: BotContext = { soundQueue: [] };

  constructor() {
    this.client = new Client({ presence: { activity: { name: 'you', type: 'WATCHING' } } });

    this.client.on('ready', () => this.onReady());
    this.client.on('message', m => this.onMessage(m));
    this.client.on('warn', m => logger.log('warn', m));
    this.client.on('error', m => logger.log('error', m));
    this.client.on('voiceStateUpdate', oldState => this.onVoiceStateUpdate(oldState));
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
      this.context.soundQueue = [];
      oldState.channel.leave();
    }
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
