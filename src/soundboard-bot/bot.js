const Discord = require('discord.js');
const constants = require('./constants');

const availableCommands = [
  require('./commands/sound')
];

class Bot {
  constructor() {
    this._client = new Discord.Client();

    this._client.on('ready', () => this._onReady());
    this._client.on('message', message => this._onMessage(message));

    this.context = { soundQueue: [] };
  }

  start() {
    return this._client.login(process.env.BOT_TOKEN);
  }

  _onReady() {
    console.log(`Logged in as ${this._client.user.tag}!`);
  }

  _onMessage(message) {
    if (!message.content.startsWith(constants.messagePrefix))
      return;

    const messageContentWithoutPrefix = message.content.replace(constants.messagePrefix, '').toLowerCase();

    availableCommands.some(command => {
      if (command.matches(messageContentWithoutPrefix)) {
        command.exec(message, this.context);
        return true;
      }
    });
  }
}

module.exports = Bot;
