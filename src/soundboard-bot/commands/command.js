const constants = require('../constants');
const logger = require('../../logger');

class Command {
  constructor(text, execFunc, options = {}) {
    this.text = text;
    this.exec = execFunc;
    this.options = options;
  }

  matches(message) {
    const matches = message.content.replace(constants.messagePrefix, '').toLowerCase().startsWith(this.text);

    if (matches) {
      logger.info('%s: Matched command "%s"', message.id, this.text);
    }

    return matches;
  }

  isValid(message) {
    if (this.options.serverOnly && !message.member) {
      logger.info('%s: Command "%s" is a server-only command but was sent by direct message', message.id, message.content);
      message.reply('This command cannot be sent by direct message, it must be sent via a server text channel.');
      return false;
    }

    if (this.options.requiredPermission && !message.member.roles.some(x => x.hasPermission(this.options.requiredPermission))) {
      logger.info('%s: Command "%s" requires permission "%s", but user "%s" did not have it', message.id, message.content, this.options.requiredPermission, message.author.username);
      message.reply('you do not have permission to use this command.');
      return false;
    }

    logger.info('%s: Command "%s" was valid', message.id, message.content);

    return true;
  }
}

module.exports = Command;
