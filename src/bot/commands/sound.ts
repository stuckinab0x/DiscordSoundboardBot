import { Message } from 'discord.js';
import logger from '../../logger';
import BotContext from '../bot-context';
import CommandMessage from '../command-message';
import constants from '../constants';
import filesService from '../files-service';
import SoundFile from '../sound-file';
import { pickRandom } from '../utils';
import Command from './command';

const insults = ['dingus', 'doofus', 'dumb dumb'];

export class SoundCommand extends Command {
  constructor() {
    super('sound', `${ constants.messagePrefix } sound <sound name>`, 'Play a sound in your current voice channel', { serverOnly: true });
  }

  async execute(message: Message, commandMessage: CommandMessage, context: BotContext): Promise<any> {
    const voiceChannel = message.member.voice.channel;

    if (!commandMessage.arguments) {
      logger.info('%s: No <filename> argument was specified', message.id);
      return message.reply(`command usage: "${ this.usage }"`);
    }

    if (!voiceChannel) {
      logger.info('%s: User was not in a voice channel', message.id);
      return message.reply('you must be in a voice channel to use this command.');
    }

    const soundFile = await this.getSoundFile(commandMessage.arguments, message);

    if (!soundFile)
      return message.reply(`couldn't find sound "${ commandMessage.arguments }".`);

    context.soundQueue.push({ sound: soundFile, channel: voiceChannel });
    logger.info('%s: Sound "%s" added to queue, length: %s', message.id, commandMessage.arguments, context.soundQueue.length);

    if (context.soundQueue.length) {
      return message.reply(`your sound has been added to the queue at position #${ context.soundQueue.length }.`);
    }
  }

  private async getSoundFile(soundName: string, message: Message): Promise<SoundFile> {
    const availableFiles = await filesService.files;
    const soundFile = availableFiles.find(x => x.name === soundName);

    if (soundFile)
      return soundFile;

    logger.info('%s: No "%s" sound was found', message.id, soundName);

    const partialMatches = availableFiles.filter(x => x.name.startsWith(soundName));

    if (!partialMatches.length)
      return null;

    if (partialMatches.length === 1) {
      return partialMatches[0];
    } else {
      logger.info('%s: Found %s partial matches for "%s"', message.id, partialMatches.length, soundName);
      return this.getUserSoundChoice(soundName, message, partialMatches);
    }
  }

  private async getUserSoundChoice(searchTerm: string, message: Message, files: SoundFile[]): Promise<SoundFile> {
    const fileChoices = files.reduce((choices, file, i) => `${ choices }\n${ i + 1 }: ${ file.name }`, '');

    await message.reply(`found multiple sounds that start with "${ searchTerm }", please choose one:${ fileChoices }`);

    try {
      const collectedMessages = await message.channel.awaitMessages((x: Message) => SoundCommand.userSoundChoiceIsValid(x, message.author.id, files.length), { max: 1, time: 30000, errors: ['time'] });
      const choice = collectedMessages.first();
      const chosenFileIndex = +choice.content - 1;

      return files[chosenFileIndex];
    } catch (err) {
      logger.info('%s: User failed to make a selection within the time limit', message.id);
      await message.reply(`no selection was made in time, try again ${ pickRandom(insults) }.`);

      return Promise.reject('Timed out waiting for sound choice');
    }
  }

  private static userSoundChoiceIsValid(message: Message, userId: string, choiceCount: number): boolean {
    const choice = +message.content;

    return message.author.id === userId && Number.isInteger(choice) && choice > 0 && choice <= choiceCount;
  }
}

export default new SoundCommand();
