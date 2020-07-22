const filesService = require('../files-service');
const Discord = require('discord.js');
const Command = require('./command');

async function execFunc(message) {
  const files = await filesService.files;

  const messageEmbed = new Discord.MessageEmbed({
    title: 'Available sounds',
    description: files.reduce((prev, curr) => prev + '\n' + curr.name, '')
  });

  return message.reply(messageEmbed);
}

module.exports = new Command('sounds', execFunc);
