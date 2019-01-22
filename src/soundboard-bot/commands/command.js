class Command {
  constructor(text, execFunc, options = {}) {
    this.text = text;
    this.exec = execFunc;
    this.options = options;
  }

  matches(messageContent) {
    return messageContent.startsWith(this.text);
  }

  isValid(message) {
    if (this.options.serverOnly && !message.member) {
      message.reply('This command cannot be sent by direct message, it must be sent via a server text channel.');
      return false;
    }

    if (this.options.requiredPermission && !message.member.roles.some(x => x.hasPermission(this.options.requiredPermission))) {
      message.reply('you do not have permission to use this command.');
      return false;
    }

    return true;
  }
}

module.exports = Command;
