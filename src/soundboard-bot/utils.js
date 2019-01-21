const fs = require('fs');

function loadFiles(directory) {
  return new Promise(resolve => {
    fs.readdir(directory, { withFileTypes: true }, (err, files) => {
      resolve(files.map(x => {
        const fullName = x.toLowerCase();
        const splitName = fullName.split('.');

        return {
          name: splitName.slice(0, splitName.length - 1).join('.'),
          type: splitName[splitName.length - 1],
          fullName
        };
      }));
    });
  });
}

module.exports = {
  loadFiles
};
