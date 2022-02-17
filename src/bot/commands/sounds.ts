import { Message, MessageEmbed } from 'discord.js';
import constants from '../constants';
import filesService from '../files-service';
import Command from './command';

export class SoundsCommand extends Command {
  constructor() {
    super('sounds', `${ constants.messagePrefix } sounds`, 'Display the list of available sounds');
  }

  async execute(message: Message): Promise<any> {
    const files = await filesService.files;

    const messageEmbed = new MessageEmbed({
      title: 'Available sounds',
      description: files.reduce((prev, curr) => prev + '\n' + curr.name, '')
    });

    return message.reply({ embeds: [messageEmbed] });
  }
}

export default new SoundsCommand();
