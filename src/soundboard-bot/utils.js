const fs = require('fs');
const logger = require('../logger');

function loadFiles(directory) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, { withFileTypes: true }, (err, files) => {
      if (err) {
        logger.error('Failed to load files: %s', err.message);
        reject(err);
      } else {
        logger.info('Loaded %s files', files.length);
        const processedFiles = files.map(x => {
          logger.info('Loaded file "%s"', x.name || x);
          return splitFileName(x);
        });

        resolve(processedFiles);
      }
    });
  });
}

function checkFileExtension(attachment, allowedExtensions) {
  return allowedExtensions.some(ext => attachment.filename.endsWith(ext));
}

function splitFileName(name) {
  const fullName = (name.name || name).toLowerCase();
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
