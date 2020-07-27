import fs from 'fs';
import { Stream } from 'stream';
import logger from '../logger';
import constants from './constants';
import SoundFile from './sound-file';
import { loadFiles, splitFileName } from './utils';

class FilesService {
  private _files: Promise<SoundFile[]>;

  constructor(private directory: string) {
  }

  get files(): Promise<SoundFile[]> {
    if (!this._files) {
      logger.info('Loading sound files');
      this._files = loadFiles(this.directory)
        .then(files => {
          files.forEach(x => logger.debug('Loaded file: %s', JSON.stringify(x)));
          return files;
        })
        .catch(err => {
          if (err.code !== 'ENOENT')
            return Promise.reject(err);

          return fs.promises.mkdir(this.directory).then(() => []);
        });
    }

    return this._files;
  }

  async saveFile(stream: Stream, name: string): Promise<void> {
    const files = await this.files;
    const fileObj = splitFileName(name);

    return new Promise((resolve, reject) => {
      if (files.some(x => x.name === fileObj.name)) {
        logger.info('A sound with the name "%s%" already exists.', fileObj.name);
        reject({ message: 'A sound with that name already exists.' });
        return;
      }

      stream.pipe(
        fs.createWriteStream(this.directory + name)
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

export default new FilesService(constants.soundsDirectory);
