import { CommandInteraction, MessageEmbed } from 'discord.js';
import filesService from '../files-service';
import Command from './command';
import constants from '../constants';

function createField(array: any[], start: number, end: number) {
  const subArray = array.slice(start, end);
  const field = {
    name: `${ subArray[0].name.substring(0, 2) } - ${ subArray[subArray.length - 1].name.substring(0, 2) }`,
    value: subArray.reduce((prev, curr) => `${ prev }\n${ curr.name }`, ''),
    inline: true,
  };
  return field;
}

export class SoundsCommand extends Command {
  constructor() {
    super('sounds', 'Display the list of available sounds.');
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    const files = await filesService.files;
    const messageEmbed = new MessageEmbed({ title: 'Available sounds' });

    if (files.length === 0) {
      messageEmbed.description = `No sounds available yet! Add one by attaching a sound file (${ constants.soundFileExtensions }) to a message with the /addsound command!`;
    } else {
      const col = Math.floor(files.length / 3);
      messageEmbed.fields = [createField(files, 0, col), createField(files, col, col * 2), createField(files, col * 2, files.length)];
    }
    return interaction.reply({ embeds: [messageEmbed], ephemeral: true });
  }
}
export default new SoundsCommand();
