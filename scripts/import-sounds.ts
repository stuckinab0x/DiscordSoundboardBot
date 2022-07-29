import { createReadStream } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { SoundsService } from 'botman-sounds';

const soundsDirectory = path.join(__dirname, '../sounds');
const soundsService = new SoundsService(
  'mongodb://localhost:27017',
  // eslint-disable-next-line max-len
  'DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://localhost:10000/devstoreaccount1;',
);

(async function run() {
  const files = await fs.readdir(soundsDirectory);

  await Promise.all(files.map(fileName => {
    const name = fileName.split('.').slice(0, -1).join('.');
    return soundsService.addSound({ name, file: createReadStream(path.join(soundsDirectory, fileName)) });
  }));

  // Script won't end due to mongo connections still being open.
  // ¯\_(ツ)_/¯
  process.exit();
}());
