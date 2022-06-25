import fs, { promises as fsPromises } from 'node:fs';
import { join } from 'node:path';

export class FilesService {
  constructor(private readonly directory: string) {}

  saveFile(name: string, fileStream: NodeJS.ReadableStream): Promise<void> {
    return new Promise((resolve, reject) => {
      fileStream.pipe(
        fs.createWriteStream(join(this.directory, name), { flags: 'wx' })
          .on('error', (error: NodeJS.ErrnoException) => {
            if (error.code === 'ENOENT')
              fs.mkdir(this.directory, () => this.saveFile(name, fileStream).then(() => resolve()));
            else
              reject(error);
          })
          .on('finish', () => {
            resolve();
          }),
      );
    });
  }

  deleteFile(name: string): Promise<void> {
    return fsPromises.rm(join(this.directory, name), { force: true });
  }
}
