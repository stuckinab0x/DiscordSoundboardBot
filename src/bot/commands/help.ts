import { MessageEmbed } from 'discord.js';
import constants from '../constants';
import Command from './command';

export default function helpConstructor(commands: Command[]): Command {
  let helpMessage: MessageEmbed;

  const helpCommand = new Command('help', `${ constants.messagePrefix } help`, 'Display the available commands', message => message.reply(helpMessage));
  const allCommands = [helpCommand].concat(commands);

  const fields = allCommands.reduce((fields, command) => {
    fields[0].value += `${ command.name }\n`;
    fields[1].value += `${ command.usage }\n`;
    fields[2].value += `${ command.description }\n`;

    return fields;
  }, [
    { name: 'Command', value: '', inline: true },
    { name: 'Usage', value: '', inline: true },
    { name: 'Description', value: '', inline: true }
  ]);

  helpMessage = new MessageEmbed({
    title: 'Available commands',
    fields
  });

  return helpCommand;
};
