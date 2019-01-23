const Discord = require('discord.js');
const constants = require('./constants');
const logger = require('../logger');

const availableCommands = [
  require('./commands/sound'),
  require('./commands/addsound')
];

class Bot {
  constructor() {
    this._client = new Discord.Client();

    this._client.on('ready', () => this._onReady());
    this._client.on('message', message => this._onMessage(message));

    this.context = { soundQueue: [] };
  }

  start() {
    logger.info('Starting bot, attempting to log in to Discord');
    return this._client.login(process.env.BOT_TOKEN);
  }

  _onReady() {
    logger.info('Logged in as %s', this._client.user.tag);
  }

  _onMessage(message) {
    if (!message.content.startsWith(constants.messagePrefix))
      return;

    logger.info('%s: Received potential command "%s" from "%s"', message.id, message.content, message.author.username);

    if (!availableCommands.some(command => {
      if (command.matches(message)) {
        if (command.isValid(message)) {
          command.exec(message, this.context);
        }

        return true;
      }
    })) {
      logger.info('%s: Command "%s" did not match any available commands', message.id, message.content);
    }
  }
}

module.exports = Bot;
