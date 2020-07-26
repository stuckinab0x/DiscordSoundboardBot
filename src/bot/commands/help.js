const Command = require('./command');
const Discord = require('discord.js');
const constants = require('../constants');

module.exports = function helpConstructor(commands) {
  let helpMessage;

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

  helpMessage = new Discord.MessageEmbed({
    title: 'Available commands',
    fields
  });

  return helpCommand;
};
