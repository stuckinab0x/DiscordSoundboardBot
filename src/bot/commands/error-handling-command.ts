import { CommandInteraction } from 'discord.js';
import logger from '../../logger';
import BotContext from '../bot-context';
import Command from './command';

export default function withErrorHandling(command: Command) {
  const exec = command.execute.bind(command);

  command.execute = async function (interaction: CommandInteraction, context: BotContext): Promise<void> {
    try {
      await exec(interaction, context);
    } catch (err) {
      logger.error('%s: An error occurred while executing command "%s"', interaction.id, interaction.commandName);
      logger.error(err);
    }
  };
}
