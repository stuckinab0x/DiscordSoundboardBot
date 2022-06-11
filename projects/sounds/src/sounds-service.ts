import { Collection, FindOptions, MongoClient } from 'mongodb';
import { Sound, SoundFile } from './sound';
import { SoundDocument } from './sound-document';

export class SoundsService {
  private readonly soundsCollection: Promise<Collection<SoundDocument>>;
  private static readonly soundFindOptions: FindOptions<SoundDocument> = { projection: { _id: 0 } };

  constructor(connectionUri: string) {
    if (!connectionUri) throw new Error('Couldn\'t instantiate SoundsService: connectionUri must be provided');

    this.soundsCollection = new MongoClient(connectionUri).connect().then(x => x.db('botman').collection('sounds'));
  }

  async getSound(name: string): Promise<Sound | null> {
    const collection = await this.soundsCollection;
    const document = await collection.findOne({ name }, SoundsService.soundFindOptions);

    if (!document) return null;

    return SoundsService.mapSoundDocumentToSound(document);
  }

  async getAllSounds(): Promise<Sound[]> {
    const collection = await this.soundsCollection;
    return collection.find({}, SoundsService.soundFindOptions).map(SoundsService.mapSoundDocumentToSound).toArray();
  }

  private static mapSoundDocumentToSound(document: SoundDocument): Sound {
    return {
      name: document.name,
      file: SoundsService.mapFileNameToSoundFile(document.fileName),
    };
  }

  private static mapFileNameToSoundFile(name: string): SoundFile {
    const splitName = name.split('.');

    return {
      name: splitName.slice(0, splitName.length - 1).join('.'),
      extension: splitName[splitName.length - 1],
      fullName: name,
    };
  }
}
