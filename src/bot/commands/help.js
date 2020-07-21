const Command = require('./command');

const help = new Command('help', function (message) {
  message.reply({
    embed: {
      title: 'Available commands:',
      fields: [
        { name: 'Command', value: '', inline: true },
        { name: 'Description', value: '', inline: true }
      ]
    }
  });
});

module.exports = help;
