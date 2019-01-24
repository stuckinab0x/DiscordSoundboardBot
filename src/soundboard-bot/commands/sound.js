const Command = require('./command');
const constants = require('../constants');
const logger = require('../../logger');
const filesService = require('../files-service');

async function execFunc(message, context) {
  const argument = message.content.toLowerCase().split(' ').slice(1).join(' ');
  const voiceChannel = message.member.voiceChannel;

  if (!argument) {
    logger.info('%s: No <filename> argument was specified', message.id);
    message.reply(`command usage: "${constants.messagePrefix}sound <filename>".`);
    return;
  }

  if (!voiceChannel) {
    logger.info('%s: User was not in a voice channel', message.id);
    message.reply('you must be in a voice channel to use this command.');
    return;
  }

  const availableFiles = await filesService.files;
  const soundFile = availableFiles.find(x => x.name === argument);
  // TODO: If file isn't found - find a file that starts with argument.

  if (!soundFile) {
    logger.info('%s: No "%s" sound was found', message.id, argument);
    message.reply(`couldn't find sound "${argument}".`);
    return;
  }

  context.soundQueue.push({ sound: soundFile, channel: voiceChannel });
  logger.info('%s: Sound "%s" added to queue, length: %s', message.id, argument, context.soundQueue.length);

  if (context.soundPlaying) {
    message.reply(`your sound has been added to the queue at position #${context.soundQueue.length}.`);
    return;
  }

  context.soundPlaying = true;

  while (context.soundQueue.length) {
    const current = context.soundQueue.shift();
    const connection = await current.channel.join();

    logger.info('Playing sound "%s", %s sounds in the queue.', current.sound.name, context.soundQueue.length);

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
