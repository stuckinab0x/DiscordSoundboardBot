class Command {
  constructor(text, execFunc) {
    this.text = text;
    this.exec = execFunc;
  }

  matches(messageContent) {
    return messageContent.startsWith(this.text);
  }
}

module.exports = Command;
