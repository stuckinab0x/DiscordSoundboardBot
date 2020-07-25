const Discord = require('discord.js');
const constants = require('./constants');
const logger = require('../logger');

const availableCommands = [
  require('./commands/sound'),
  require('./commands/sounds'),
  require('./commands/addsound')
];

const helpCommand = require('./commands/help')(availableCommands);

availableCommands.push(helpCommand);

class Bot {
  #client;
  #context = { soundQueue: [] };

  constructor() {
    this.#client = new Discord.Client({ presence: { activity: { name: 'you', type: 'WATCHING' } } });

    this.#client.on('ready', () => this._onReady());
    this.#client.on('message', m => this._onMessage(m));
    this.#client.on('warn', m => logger.log('warn', m));
    this.#client.on('error', m => logger.log('error', m));
    this.#client.on('voiceStateUpdate', oldState => this._onVoiceStateUpdate(oldState));
  }

  start(token) {
    logger.info('Starting bot, attempting to log in to Discord');
    return this.#client.login(token);
  }

  _onReady() {
    logger.info('Logged in as %s', this.#client.user.tag);
  }

  _onMessage(message) {
    if (!message.content.startsWith(constants.messagePrefix))
      return;

    if (message.content === constants.messagePrefix)
      return helpCommand.exec(message, this.#context);

    logger.info('%s: Received potential command "%s" from "%s"', message.id, message.content, message.author.username);

    if (!availableCommands.some(command => {
      if (command.matches(message)) {
        if (command.isValid(message)) {
          command.exec(message, this.#context);
        }

        return true;
      }
    })) {
      logger.info('%s: Command "%s" did not match any available commands', message.id, message.content);
    }
  }

  _onVoiceStateUpdate(oldState) {
    if (oldState.channel && oldState.channel.members.every(x => x.id === this.#client.user.id)) {
      this.#context.soundQueue = [];
      oldState.channel.leave();
    }
  }
}

module.exports = Bot;
