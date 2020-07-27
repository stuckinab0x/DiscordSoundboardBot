import constants from '../constants';
import Command, { CommandExecFunc } from './command';

const execFunc: CommandExecFunc = message => {
  if (message.guild.voice && message.guild.voice.connection)
    message.guild.voice.connection.disconnect();
};

export default new Command('disconnect', `${ constants.messagePrefix } disconnect`, 'Disconnect the bot from a voice channel', execFunc, { serverOnly: true });
