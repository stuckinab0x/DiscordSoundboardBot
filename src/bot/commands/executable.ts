import { CommandInteraction } from 'discord.js';
import BotContext from '../bot-context';

export default interface Executable {
  execute(interaction: CommandInteraction, context: BotContext): any;
}
