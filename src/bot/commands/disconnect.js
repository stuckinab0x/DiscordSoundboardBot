const Command = require('./command');
const constants = require('../constants');

async function execFunc(message) {
  if (message.guild.voice && message.guild.voice.connection)
    message.guild.voice.connection.disconnect();
}

module.exports = new Command('disconnect', `${ constants.messagePrefix } disconnect`, 'Disconnect the bot from a voice channel', execFunc, { serverOnly: true });
