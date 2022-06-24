import { MongoClient } from 'mongodb';
import { SoundDocument } from 'botman-sounds/src/sound-document';
import { SoundFile } from 'botman-sounds';
import { promises as fs } from 'fs';

// Use this script to import sounds from a folder into a mongo database.
// Doesn't check for or clear existing documents, so running it twice will produce duplicates.

const connectionUri = 'mongodb://localhost:27017';
const soundsDirectory = '../bot/sounds';

function splitFileName(name: string): SoundFile {
  const fullName = name.toLowerCase();
  const splitName = fullName.split('.');

  return {
    name: splitName.slice(0, splitName.length - 1).join('.'),
    extension: splitName[splitName.length - 1],
    fullName,
  };
}

function loadFiles(directory: string): Promise<SoundFile[]> {
  return fs.readdir(directory, { withFileTypes: true }).then(files => files.map(x => splitFileName(x.name)));
}

new MongoClient(connectionUri).connect().then(client => {
  const soundsCollection = client.db('botman').collection('sounds');

  loadFiles(soundsDirectory)
    .then(files => {
      const soundDocuments: SoundDocument[] = files.map(x => ({
        name: x.name,
        fileName: x.fullName,
      }));

      return soundsCollection.insertMany(soundDocuments);
    })
    .then(result => {
      console.log(result.insertedIds);
    });
});
