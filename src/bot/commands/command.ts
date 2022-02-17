import { Message, PermissionResolvable } from 'discord.js';
import logger from '../../logger';
import BotContext from '../bot-context';
import CommandMessage from '../command-message';
import withErrorHandling from './error-handling-command';

export interface CommandOptions {
  serverOnly?: boolean;
  requiredPermission?: PermissionResolvable;
}

export default abstract class Command {
  protected constructor(public name: string, public usage: string, public description: string, private options: CommandOptions = {}) {
    withErrorHandling(this);
  }

  async isValid(message: Message): Promise<boolean> {
    if (this.options.serverOnly && !message.member) {
      logger.info('%s: Command "%s" is a server-only command but was sent by direct message', message.id, message.content);
      await message.reply('This command cannot be sent by direct message, it must be sent via a server text channel.');
      return false;
    }

    if (this.options.requiredPermission && !message.member.permissions.has(this.options.requiredPermission)) {
      logger.info('%s: Command "%s" requires permission "%s", but user "%s" did not have it', message.id, message.content, this.options.requiredPermission, message.author.username);
      await message.reply('You do not have permission to use this command.');
      return false;
    }

    logger.info('%s: Command "%s" was valid', message.id, message.content);

    return true;
  }

  abstract execute(message: Message, commandMessage: CommandMessage, context: BotContext): any;
}
