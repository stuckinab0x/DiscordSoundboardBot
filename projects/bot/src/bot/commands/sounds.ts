import { CommandInteraction, EmbedBuilder, MessageFlags } from 'discord.js';
import Command from './command';
import constants from '../constants';
import BotContext from '../bot-context';

function createField(array: any[], start: number, end: number) {
  const subArray = array.slice(start, end);

  return {
    name: `${ subArray[0].name.substring(0, 2) } - ${ subArray[subArray.length - 1].name.substring(0, 2) }`,
    value: subArray.reduce((prev, curr) => `${ prev }\n${ curr.name }`, ''),
    inline: true,
  };
}

export class SoundsCommand extends Command {
  constructor() {
    super('sounds', 'Display the list of available sounds.');
  }

  async execute(interaction: CommandInteraction, context: BotContext): Promise<any> {
    const files = await context.soundsService.getAllSounds();
    const messageEmbed = new EmbedBuilder({ title: 'Available sounds' });

    if (files.length === 0) {
      messageEmbed.setDescription(`No sounds available yet! Add one by attaching a sound file (${ constants.soundFileExtensions }) to a message with the /addsound command!`);
    } else {
      const col = Math.floor(files.length / 3);
      messageEmbed.setFields([createField(files, 0, col), createField(files, col, col * 2), createField(files, col * 2, files.length)]);
    }
    return interaction.reply({ embeds: [messageEmbed], flags: MessageFlags.Ephemeral });
  }
}

export default new SoundsCommand();
