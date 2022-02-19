import { CommandInteraction, MessageEmbed } from 'discord.js';
import filesService from '../files-service';
import Command from './command';

export class SoundsCommand extends Command {
  constructor() {
    super('sounds', 'Display the list of available sounds.');
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    const files = await filesService.files;

    const messageEmbed = new MessageEmbed({
      title: 'Available sounds',
      description: files.reduce((prev, curr) => prev + '\n' + curr.name, '')
    });

    return interaction.reply({ embeds: [messageEmbed], ephemeral: true });
  }
}

export default new SoundsCommand();
