const Command = require('./command');
const { loadFiles } = require('../utils');

const soundsDirectory = './sounds/';

const sound = new Command('sound', async function (message, context) {
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

  context.soundQueue.push({ sound: soundFile, channel: voiceChannel });

  if (context.soundPlaying) {
    message.reply(`your sound has been added to the queue at position #${context.soundQueue.length}.`);
    return;
  }

  context.soundPlaying = true;

  while (context.soundQueue.length) {
    const current = context.soundQueue.shift();
    const connection = await current.channel.join();
    const dispatcher = connection.playFile(soundsDirectory + current.sound.fullName);

    await new Promise(resolve => dispatcher.on('end', () => {
      if (!context.soundQueue.length) {
        current.channel.leave();
      }

      resolve();
    }));
  }

  context.soundPlaying = false;
});

module.exports = sound;
