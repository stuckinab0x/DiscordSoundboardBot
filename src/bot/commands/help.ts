import { Message, MessageEmbed } from 'discord.js';
import constants from '../constants';
import Command from './command';

export default class HelpCommand extends Command {
  private readonly helpMessage: MessageEmbed;

  constructor(commands: Command[]) {
    super('help', `${ constants.messagePrefix } help`, 'Display the available commands');

    const allCommands = commands.concat(this);

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

    this.helpMessage = new MessageEmbed({
      title: 'Available commands',
      fields
    });
  }

  execute(message: Message): Promise<any> {
    return message.reply(this.helpMessage);
  }
}
