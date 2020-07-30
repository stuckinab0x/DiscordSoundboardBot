import { Message } from 'discord.js';
import constants from '../constants';
import Command from './command';

export class SourceCommand extends Command {
  constructor() {
    super('source', `${ constants.messagePrefix } source`, 'Display the URL to the source code for this bot');
  }

  execute(message: Message): Promise<any> {
    return message.reply('https://github.com/UncleDave/DiscordSoundboardBot');
  }
}

export default new SourceCommand();
