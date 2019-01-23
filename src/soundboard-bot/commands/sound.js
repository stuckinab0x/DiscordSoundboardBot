const Command = require('./command');
const constants = require('../constants');
const { loadFiles } = require('../utils');

async function execFunc(message, context) {
  const argument = message.content.toLowerCase().split(' ').slice(1).join(' ');
  const voiceChannel = message.member.voiceChannel;

  if (!argument) {
    message.reply(`command usage: "${constants.messagePrefix}sound <filename>".`);
    return;
  }

  if (!voiceChannel) {
    message.reply('you must be in a voice channel to use this command.');
    return;
  }

  const availableFiles = await loadFiles(constants.soundsDirectory);
  const soundFile = availableFiles.find(x => x.name === argument);
  // TODO: If file isn't found - find a file that starts with argument.

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
    const dispatcher = connection.playFile(constants.soundsDirectory + current.sound.fullName);

    await new Promise(resolve => dispatcher.on('end', () => {
      if (!context.soundQueue.length) {
        current.channel.leave();
      }

      resolve();
    }));
  }

  context.soundPlaying = false;
}

const sound = new Command('sound', execFunc, { serverOnly: true });

module.exports = sound;
