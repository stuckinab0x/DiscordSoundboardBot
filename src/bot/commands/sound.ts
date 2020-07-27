import logger from '../../logger';
import constants from '../constants';
import filesService from '../files-service';
import Command, { CommandExecFunc } from './command';

const execFunc: CommandExecFunc = async (message, context) => {
  const argument = message.content.toLowerCase().split(' ').slice(2).join(' ');
  const voiceChannel = message.member.voice.channel;

  if (!argument) {
    logger.info('%s: No <filename> argument was specified', message.id);
    return message.reply(`command usage: "${ constants.messagePrefix } sound <filename>".`);
  }

  if (!voiceChannel) {
    logger.info('%s: User was not in a voice channel', message.id);
    return message.reply('you must be in a voice channel to use this command.');
  }

  const availableFiles = await filesService.files;
  const soundFile = availableFiles.find(x => x.name === argument);
  // TODO: If file isn't found - find a file that starts with argument.

  if (!soundFile) {
    logger.info('%s: No "%s" sound was found', message.id, argument);
    return message.reply(`couldn't find sound "${ argument }".`);
  }

  context.soundQueue.push({ sound: soundFile, channel: voiceChannel });
  logger.info('%s: Sound "%s" added to queue, length: %s', message.id, argument, context.soundQueue.length);

  if (context.soundPlaying) {
    return message.reply(`your sound has been added to the queue at position #${ context.soundQueue.length }.`);
  }

  context.soundPlaying = true;

  while (context.soundQueue.length) {
    const current = context.soundQueue.shift();
    const connection = await current.channel.join();

    logger.info('Playing sound "%s", %s sounds in the queue.', current.sound.name, context.soundQueue.length);

    const soundFileName = constants.soundsDirectory + current.sound.fullName;

    logger.debug('Attempting to play file %s', soundFileName);

    const dispatcher = connection.play(soundFileName);

    await new Promise(resolve => dispatcher.on('finish', resolve));
  }

  context.soundPlaying = false;
};

export default new Command('sound', `${ constants.messagePrefix } sound <sound name>`, 'Play a sound in your current voice channel', execFunc, { serverOnly: true });
