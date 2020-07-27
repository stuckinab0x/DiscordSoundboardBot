import { MessageEmbed } from 'discord.js';
import constants from '../constants';
import filesService from '../files-service';
import Command, { CommandExecFunc } from './command';

const execFunc: CommandExecFunc = async message => {
  const files = await filesService.files;

  const messageEmbed = new MessageEmbed({
    title: 'Available sounds',
    description: files.reduce((prev, curr) => prev + '\n' + curr.name, '')
  });

  return message.reply(messageEmbed);
};

export default new Command('sounds', `${ constants.messagePrefix } sounds`, 'Display the list of available sounds', execFunc);
