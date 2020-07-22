const Discord = require('discord.js');
const constants = require('./constants');
const logger = require('../logger');

const availableCommands = [
  require('./commands/sound'),
  require('./commands/sounds'),
  require('./commands/addsound')
];

class Bot {
  constructor() {
    this._client = new Discord.Client({ presence: { activity: { name: 'you', type: 'WATCHING' } } });

    this._client.on('ready', () => this._onReady());
    this._client.on('message', m => this._onMessage(m));
    this._client.on('warn', m => logger.log('warn', m));
    this._client.on('error', m => logger.log('error', m));

    this.context = { soundQueue: [] };
  }

  start(token) {
    logger.info('Starting bot, attempting to log in to Discord');
    return this._client.login(token);
  }

  _onReady() {
    logger.info('Logged in as %s', this._client.user.tag);
  }

  _onMessage(message) {
    if (!message.content.startsWith(constants.messagePrefix))
      return;

    // if (message.content === constants.messagePrefix)
    // print help

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
