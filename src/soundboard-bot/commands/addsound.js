const request = require('request');
const Command = require('./command');
const constants = require('../constants');
const filesService = require('../files-service');
const { checkFileExtension } = require('../utils');

function execFunc(message) {
  if (!message.attachments.size) {
    message.reply('this command must be used as the comment of a sound file attachment.');
    return;
  }

  const attachment = message.attachments.first();

  if (!checkFileExtension(attachment, constants.soundFileExtensions)) {
    message.reply(`attachment was not a valid file type. Valid file types: ${constants.soundFileExtensions.join(', ')}.`);
    return;
  }

  filesService
    .saveFile(
      request(attachment.url).on('error', err => console.error(err)),
      attachment.filename.replace(/_/g, ' ').toLowerCase()
    )
    .then(() => message.reply('your sound has been added.'))
    .catch(error => message.reply(`an error occurred while saving your sound: ${error.message}`));
}

const addSound = new Command('addsound', execFunc, { serverOnly: true, requiredPermission: +process.env.ADD_SOUND_PERMISSION });

module.exports = addSound;
