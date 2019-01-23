const fs = require('fs');

function loadFiles(directory) {
  return new Promise(resolve => {
    fs.readdir(directory, { withFileTypes: true }, (err, files) => resolve(files.map(splitFileName)));
  });
}

function checkFileExtensions(attachments, allowedExtensions) {
  const validAttachments = attachments.filter(x => allowedExtensions.some(ext => x.filename.endsWith(ext)));

  return {
    validAttachments,
    invalidCount: attachments.length - validAttachments.length
  };
}

function splitFileName(name) {
  const fullName = name.toLowerCase();
  const splitName = fullName.split('.');

  return {
    name: splitName.slice(0, splitName.length - 1).join('.'),
    type: splitName[splitName.length - 1],
    fullName
  };
}

module.exports = {
  loadFiles,
  checkFileExtensions,
  splitFileName
};
