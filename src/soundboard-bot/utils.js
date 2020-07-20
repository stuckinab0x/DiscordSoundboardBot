const { promises: fs } = require('fs');

function loadFiles(directory) {
  return fs.readdir(directory, { withFileTypes: true }).then(files => files.map(x => splitFileName(x.name)));
}

function checkFileExtension(attachment, allowedExtensions) {
  return allowedExtensions.some(ext => attachment.name.endsWith(ext));
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
  checkFileExtension,
  splitFileName
};
