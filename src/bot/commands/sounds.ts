import { CommandInteraction, MessageEmbed } from 'discord.js';
import filesService from '../files-service';
import Command from './command';
import constants from '../constants';

export class SoundsCommand extends Command {
  constructor() {
    super('sounds', 'Display the list of available sounds.');
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    const files = await filesService.files;

    const colLength = Math.floor(files.length / 3);
    const files1 = files.slice(0, colLength);
    const files2 = files.slice(colLength, colLength * 2);
    const files3 = files.slice(colLength * 2, files.length);

    const messageEmbed = new MessageEmbed({ title: 'Available sounds' });

    if (files1.length === 0) {
      messageEmbed.description = `No sounds available yet! Add one by attaching a sound file (${ constants.soundFileExtensions }) to a message with the /addsound command!`;
    } else {
      const files1ABC = `${ files1[1].name.substring(0, 2) } - ${ files1[files1.length - 1].name.substring(0, 2) }`;
      const files2ABC = `${ files2[1].name.substring(0, 2) } - ${ files2[files2.length - 1].name.substring(0, 2) }`;
      const files3ABC = `${ files3[1].name.substring(0, 2) } - ${ files3[files3.length - 1].name.substring(0, 2) }`;

      messageEmbed.fields = [
        {
          name: files1ABC,
          value: files1.reduce((prev, curr) => `${ prev }\n${ curr.name }`, ''),
          inline: true,
        },
        {
          name: files2ABC,
          value: files2.reduce((prev, curr) => `${ prev }\n${ curr.name }`, ''),
          inline: true,
        },
        {
          name: files3ABC,
          value: files3.reduce((prev, curr) => `${ prev }\n${ curr.name }`, ''),
          inline: true,
        },
      ];
    }
    return interaction.reply({ embeds: [messageEmbed], ephemeral: true });
  }
}

export default new SoundsCommand();
