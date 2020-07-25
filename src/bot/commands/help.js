const Command = require('./command');
const Discord = require('discord.js');
const constants = require('../constants');

const ZERO_WIDTH_SPACE = '\u200B';

module.exports = function helpConstructor(commands) {
  let helpMessage;
  const helpCommand = new Command('help', `${ constants.messagePrefix } help`, 'Display the available commands', message => message.reply(helpMessage));
  const firstCommand = commands[0];
  const otherCommands = commands
    .slice(1)
    .concat(helpCommand)
    .map(x => [
      { name: ZERO_WIDTH_SPACE, value: x.name, inline: true },
      { name: ZERO_WIDTH_SPACE, value: x.usage, inline: true },
      { name: ZERO_WIDTH_SPACE, value: x.description, inline: true }
    ])
    .flat();

  helpMessage = new Discord.MessageEmbed({
    title: 'Available commands',
    fields: [
      { name: 'Command', value: firstCommand.name, inline: true },
      { name: 'Usage', value: firstCommand.usage, inline: true },
      { name: 'Description', value: firstCommand.description, inline: true },
      ...otherCommands
    ]
  });

  return helpCommand;
};
