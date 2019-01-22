const fs = require('fs');
const { loadFiles } = require('./utils');

class FilesService {
  getFiles(directory) {
    if (!this._files) {
      this._files = loadFiles(directory);
    }

    return this._files;
  }

  saveFile(stream, directory, name) {
    return new Promise((resolve, reject) => {
      stream.pipe(
        fs.createWriteStream(directory + name)
      );
    });
  }
}

module.exports = new FilesService();
