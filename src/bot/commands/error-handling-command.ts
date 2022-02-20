import { CommandInteraction } from 'discord.js';
import logger from '../../logger';
import BotContext from '../bot-context';
import Executable from './executable';

export default function withErrorHandling(executable: Executable) {
  const exec = executable.execute.bind(executable);

  // eslint-disable-next-line no-param-reassign
  executable.execute = async function execute(interaction: CommandInteraction, context: BotContext): Promise<void> {
    try {
      await exec(interaction, context);
    } catch (err) {
      logger.error('%s: An error occurred while executing command "%s"', interaction.id, interaction.commandName);
      logger.error(err);
    }
  };
}
