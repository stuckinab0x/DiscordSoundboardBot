import { CommandInteraction } from 'discord.js';
import Command from './command';

export class SourceCommand extends Command {
  constructor() {
    super('source', 'Post a link to this bot\'s source code.');
  }

  execute(interaction: CommandInteraction): Promise<any> {
    return interaction.reply('https://github.com/UncleDave/DiscordSoundboardBot');
  }
}

export default new SourceCommand();
