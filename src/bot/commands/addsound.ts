import axios from 'axios';
import Discord, { Message } from 'discord.js';
import logger from '../../logger';
import constants from '../constants';
import filesService from '../files-service';
import { checkFileExtension, splitFileName } from '../utils';
import Command from './command';

export class AddSoundCommand extends Command {
  constructor() {
    super('addsound', `${ constants.messagePrefix } addsound`, 'Used as the comment with a sound file attachment', { serverOnly: true, requiredPermission: Discord.Permissions.FLAGS.MANAGE_GUILD });
  }

  execute(message: Message): Promise<any> {
    if (!message.attachments.size) {
      logger.info('%s: message had no attachment.', message.id);
      return message.reply('this command must be used as the comment of a sound file attachment.');
    }

    const attachment = message.attachments.first();

    if (!checkFileExtension(attachment.name, constants.soundFileExtensions)) {
      const allowedExtensions = constants.soundFileExtensions.join(', ');
      const splitAttachmentName = splitFileName(attachment.name);
      const extension = '.' + splitAttachmentName.type;

      logger.info('%s: attachment was of type "%s", expected one of "%s".', message.id, extension, allowedExtensions);
      return message.reply(`attachment was not a valid file type. Valid file types: ${ allowedExtensions }.`);
    }

    return axios(attachment.url, { responseType: 'stream' })
      .then(({ data }) => filesService.saveFile(data, attachment.name.replace(/_/g, ' ').toLowerCase()))
      .then(() => message.reply('your sound has been added.'))
      .catch(error => message.reply(`an error occurred while saving your sound: ${ error.message }`)
        .then(() => Promise.reject(error)));
  }
}

export default new AddSoundCommand();
