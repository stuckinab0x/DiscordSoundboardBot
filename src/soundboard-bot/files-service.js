const fs = require('fs');
const { loadFiles, splitFileName } = require('./utils');
const constants = require('./constants');

class FilesService {
  getFiles() {
    if (!this._files) {
      this._files = loadFiles(constants.soundsDirectory);
    }

    return this._files;
  }

  async saveFile(stream, name) {
    const files = await this.getFiles();
    const fileObj = splitFileName(name);

    return new Promise((resolve, reject) => {
      if (files.some(x => x.name === fileObj.name)) {
        reject({ message: 'A sound with that name already exists.' });
        return;
      }

      stream.pipe(
        fs.createWriteStream(constants.soundsDirectory + name)
          .on('error', error => reject(error))
          .on('finish', () => {
            files.push(fileObj);
            resolve();
          })
      );
    });
  }
}

module.exports = new FilesService();
