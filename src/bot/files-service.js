const fs = require('fs');
const { loadFiles, splitFileName } = require('./utils');
const constants = require('./constants');
const logger = require('../logger');

class FilesService {
  #directory;
  #files;

  constructor(directory) {
    this.#directory = directory;
  }

  get files() {
    if (!this.#files) {
      logger.info('Loading sound files');
      this.#files = loadFiles(this.#directory)
        .then(files => {
          files.forEach(x => logger.debug('Loaded file: %s', JSON.stringify(x)));
          return files;
        })
        .catch(err => {
          if (err.code !== 'ENOENT')
            return Promise.reject(err);

          return fs.promises.mkdir(this.#directory).then(() => []);
        });
    }

    return this.#files;
  }

  async saveFile(stream, name) {
    const files = await this.files;
    const fileObj = splitFileName(name);

    return new Promise((resolve, reject) => {
      if (files.some(x => x.name === fileObj.name)) {
        logger.info('A sound with the name "%s%" already exists.', fileObj.name);
        reject({ message: 'A sound with that name already exists.' });
        return;
      }

      stream.pipe(
        fs.createWriteStream(this.#directory + name)
          .on('error', error => {
            logger.error('Failed to write file "%s": %s', name, error.message);
            reject(error);
          })
          .on('finish', () => {
            logger.info('Wrote file "%s"', name);
            files.push(fileObj);
            resolve();
          })
      );
    });
  }
}

module.exports = new FilesService(constants.soundsDirectory);
