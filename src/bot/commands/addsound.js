const axios = require('axios');
const Command = require('./command');
const constants = require('../constants');
const filesService = require('../files-service');
const { checkFileExtension } = require('../utils');
const logger = require('../../logger');
const Discord = require('discord.js');

function execFunc(message) {
  if (!message.attachments.size) {
    logger.info('%s: message had no attachment.', message.id);
    message.reply('this command must be used as the comment of a sound file attachment.');
    return;
  }

  const attachment = message.attachments.first();

  if (!checkFileExtension(attachment, constants.soundFileExtensions)) {
    const allowedExtensions = constants.soundFileExtensions.join(', ');
    const splitAttachmentName = attachment.filename.split('.');
    const extension = '.' + splitAttachmentName[splitAttachmentName.length - 1];

    logger.info('%s: attachment was of type "%s", expected one of "%s".', message.id, extension, allowedExtensions);
    message.reply(`attachment was not a valid file type. Valid file types: ${ allowedExtensions }.`);
    return;
  }

  return axios(attachment.url, { responseType: 'stream' })
    .then(({ data }) => filesService.saveFile(data, attachment.name.replace(/_/g, ' ').toLowerCase()))
    .then(() => message.reply('your sound has been added.'))
    .catch(error => {
      message.reply(`an error occurred while saving your sound: ${ error.message }`);
      return Promise.reject(error);
    });
}

const addSound = new Command('addsound', execFunc, { serverOnly: true, requiredPermission: Discord.Permissions.FLAGS.MANAGE_GUILD });

module.exports = addSound;
