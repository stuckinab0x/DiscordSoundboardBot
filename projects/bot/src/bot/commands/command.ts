import { ChatInputApplicationCommandData, CommandInteraction, MessageFlags, PermissionResolvable } from 'discord.js';
import logger from '../../logger';
import BotContext from '../bot-context';
import withErrorHandling from './error-handling-command';
import Executable from './executable';

export interface CommandOptions {
  serverOnly?: boolean;
  requiredPermission?: PermissionResolvable;
}

export default abstract class Command implements Executable {
  public commandData: ChatInputApplicationCommandData;

  protected constructor(name: string, description: string, private options: CommandOptions = {}) {
    withErrorHandling(this);

    this.commandData = {
      name,
      description,
    };
  }

  async isValid(interaction: CommandInteraction): Promise<boolean> {
    if (this.options.serverOnly && !interaction.inGuild()) {
      logger.info('%s: Command "%s" is a server-only command but was sent by direct message', interaction.id, interaction.commandName);
      await interaction.reply({
        content: 'This command cannot be sent by direct message, it must be sent via a server text channel.',
        flags: MessageFlags.Ephemeral,
      });
      return false;
    }

    if (this.options.requiredPermission && !interaction.memberPermissions!.has(this.options.requiredPermission)) {
      logger.info('%s: Command "%s" requires permission "%s", but user "%s" did not have it', interaction.id, interaction.commandName, this.options.requiredPermission, interaction.user.username);
      await interaction.reply({
        content: 'You do not have permission to use this command.',
        flags: MessageFlags.Ephemeral,
      });
      return false;
    }

    logger.info('%s: Command "%s" was valid', interaction.id, interaction.commandName);

    return true;
  }

  abstract execute(interaction: CommandInteraction, context: BotContext): any;
}
