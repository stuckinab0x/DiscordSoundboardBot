const Command = require('./command');
const { loadFiles } = require('../utils');

const soundsDirectory = './sounds/';

const sound = new Command('sound', async function (message) {
  const argument = message.content.toLowerCase().split(' ')[1];
  const voiceChannel = message.member.voiceChannel;

  if (!argument) {
    message.reply('command usage: "!sound <filename>".');
    return;
  }

  if (!voiceChannel) {
    message.reply('you must be in a voice channel to use this command, also Lewis is a cunt.');
    return;
  }

  const availableFiles = await loadFiles(soundsDirectory);
  const soundFile = availableFiles.find(x => x.name === argument);

  if (!soundFile) {
    message.reply(`couldn't find sound "${argument}".`);
    return;
  }

  const connection = await voiceChannel.join();
  const dispatcher = connection.playFile(soundsDirectory + soundFile.fullName);

  dispatcher.on('end', () => voiceChannel.leave());
});

module.exports = sound;
