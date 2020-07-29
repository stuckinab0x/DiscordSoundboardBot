import { Message } from 'discord.js';
import logger from '../../logger';
import BotContext from '../bot-context';
import Command from './command';

export default function withErrorHandling(command: Command) {
  const exec = command.execute.bind(command);

  command.execute = async function (message: Message, context: BotContext): Promise<void> {
    try {
      await exec(message, context);
    } catch (err) {
      logger.error('%s: An error occurred while executing command "%s"', message.id, message.content);
      logger.error(err);
    }
  };
}
