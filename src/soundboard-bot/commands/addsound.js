const request = require('request');
const fs = require('fs');
const Command = require('./command');
const constants = require('../constants');
const { checkFileExtensions } = require('../utils');

function execFunc(message) {
  if (!message.attachments.size) {
    message.reply('this command must be used as the comment of a sound file attachment.');
    return;
  }

  const checkedAttachments = checkFileExtensions(message.attachments, constants.soundFileExtensions);

  if (!checkedAttachments.validAttachments.length) {
    message.reply(`no attachments were of a valid file type. Valid file types: ${constants.soundFileExtensions.join(', ')}.`);
    return;
  }

  if (checkedAttachments.invalidCount) {
    message.reply(`${checkedAttachments.invalidCount} files had invalid extensions and have been discarded.`);
  }

  checkedAttachments.validAttachments.forEach(x => request(x.url)
    .on('error', err => console.error(err))
    .pipe(fs.createWriteStream(constants.soundsDirectory + x.filename))
  );
}

const addSound = new Command('addsound', execFunc, { serverOnly: true, requiredPermission: process.env.ADD_SOUND_PERMISSION });

module.exports = addSound;
