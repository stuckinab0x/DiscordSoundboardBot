const request = require('request');
const Command = require('./command');
const constants = require('../constants');
const filesService = require('../files-service');
const { checkFileExtensions } = require('../utils');

function execFunc(message) {
  if (!message.attachments.size) {
    message.reply('this command must be used as the comment of a sound file attachment.');
    return;
  }

  const checkedAttachments = checkFileExtensions(message.attachments, constants.soundFileExtensions);

  if (!checkedAttachments.validAttachments.size) {
    message.reply(`no attachments were of a valid file type. Valid file types: ${constants.soundFileExtensions.join(', ')}.`);
    return;
  }

  if (checkedAttachments.invalidCount) {
    message.reply(`${checkedAttachments.invalidCount} files had invalid extensions and have been discarded.`);
  }

  checkedAttachments.validAttachments.forEach(x => {
    filesService
      .saveFile(
        request(x.url).on('error', err => console.error(err)),
        x.filename.replace(/_/g, ' ').toLowerCase()
      )
      .then(() => message.reply('your sound has been added.'))
      .catch(error => message.reply(`an error occurred while saving your sound: ${error.message}`));
  });
}

const addSound = new Command('addsound', execFunc, { serverOnly: true, requiredPermission: process.env.ADD_SOUND_PERMISSION });

module.exports = addSound;
