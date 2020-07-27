import { Message, PermissionResolvable } from 'discord.js';
import logger from '../../logger';
import BotContext from '../bot-context';

export type CommandExecFunc = (message: Message, context: BotContext) => Promise<any> | any;

export interface CommandOptions {
  serverOnly?: boolean;
  requiredPermission?: PermissionResolvable;
}

export default class Command {
  constructor(public name: string, public usage: string, public description: string, private execFunc: CommandExecFunc, private options: CommandOptions = {}) {
  }

  matches(message: Message): boolean {
    const matches = message.content.split(' ')[1].toLowerCase() === this.name;

    if (matches) {
      logger.info('%s: Matched command "%s"', message.id, this.name);
    }

    return matches;
  }

  isValid(message: Message): boolean {
    if (this.options.serverOnly && !message.member) {
      logger.info('%s: Command "%s" is a server-only command but was sent by direct message', message.id, message.content);
      message.reply('This command cannot be sent by direct message, it must be sent via a server text channel.');
      return false;
    }

    if (this.options.requiredPermission && !message.member.hasPermission(this.options.requiredPermission)) {
      logger.info('%s: Command "%s" requires permission "%s", but user "%s" did not have it', message.id, message.content, this.options.requiredPermission, message.author.username);
      message.reply('you do not have permission to use this command.');
      return false;
    }

    logger.info('%s: Command "%s" was valid', message.id, message.content);

    return true;
  }

  async exec(message: Message, context: BotContext): Promise<void> {
    try {
      await this.execFunc(message, context);
    } catch (err) {
      logger.error('%s: An error occurred while executing command "%s"', message.id, message.content);
      logger.error(err);
    }
  }
}

// TODO: Turn this into an abstract class
