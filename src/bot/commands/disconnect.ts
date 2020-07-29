import { Message } from 'discord.js';
import constants from '../constants';
import Command from './command';

export class DisconnectCommand extends Command {
  constructor() {
    super('disconnect', `${ constants.messagePrefix } disconnect`, 'Disconnect the bot from a voice channel', { serverOnly: true });
  }

  execute(message: Message): void {
    if (message.guild.voice && message.guild.voice.connection)
      message.guild.voice.connection.disconnect();
  }
}

export default new DisconnectCommand();
