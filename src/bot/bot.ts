import { Client, Message, VoiceState } from 'discord.js';
import logger from '../logger';
import BotContext from './bot-context';
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

  private onMessage(message: Message) {
    if (!message.content.startsWith(constants.messagePrefix))
      return;

    if (message.content === constants.messagePrefix)
      return helpCommand.execute(message, this.context);

    logger.info('%s: Received potential command "%s" from "%s"', message.id, message.content, message.author.username);

    if (!commands.some(command => {
      if (command.matches(message)) {
        if (command.isValid(message)) {
          command.execute(message, this.context);
        }

        return true;
      }
    })) {
      logger.info('%s: Command "%s" did not match any available commands', message.id, message.content);
    }
  }

  private onVoiceStateUpdate(oldState: VoiceState) {
    if (oldState.channel && oldState.channel.members.every(x => x.id === this.client.user.id)) {
      this.context.soundQueue = [];
      oldState.channel.leave();
    }
  }
}
