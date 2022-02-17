import axios from 'axios';
import Discord, { Message } from 'discord.js';
import logger from '../../logger';
import constants from '../constants';
import filesService from '../files-service';
import { checkFileExtension, splitFileName } from '../utils';
import Command from './command';

export class AddSoundCommand extends Command {
  constructor() {
    super('addsound', `${ constants.messagePrefix } addsound`, 'Used as the message with a sound file upload', { serverOnly: true, requiredPermission: Discord.Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS });
  }

  execute(message: Message): Promise<any> {
    if (!message.attachments.size) {
      logger.info('%s: message had no attachment.', message.id);
      return message.reply('This command must be used with a file upload.');
    }

    const attachment = message.attachments.first();

    if (!checkFileExtension(attachment.name, constants.soundFileExtensions)) {
      const allowedExtensions = constants.soundFileExtensions.join(', ');
      const splitAttachmentName = splitFileName(attachment.name);
      const extension = '.' + splitAttachmentName.type;

      logger.info('%s: attachment was of type "%s", expected one of "%s".', message.id, extension, allowedExtensions);
      return message.reply(`Upload was not a valid file type. Valid file types: ${ allowedExtensions }.`);
    }

    return axios(attachment.url, { responseType: 'stream' })
      .then(({ data }) => filesService.saveFile(data, attachment.name.replace(/_/g, ' ').toLowerCase()))
      .then(() => message.reply('Your sound has been added.'))
      .catch(error => message.reply(`An error occurred while saving your sound: ${ error.message }`)
        .then(() => Promise.reject(error)));
  }
}

export default new AddSoundCommand();
