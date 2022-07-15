import { Collection, Filter, FindOptions, MongoClient } from 'mongodb';
import { Sound, SoundFile } from './sound';
import { SoundDocument } from './sound-document';
import { FilesService } from './files-service';
import { errors } from './errors';

export interface AddSoundOptions {
  name: string;
  fileName: string;
  fileStream: NodeJS.ReadableStream;
}

export class ReadOnlySoundsService {
  private static readonly soundFindOptions: FindOptions<SoundDocument> = { projection: { _id: 0 } };

  protected readonly soundsCollection: Promise<Collection<SoundDocument>>;

  constructor(connectionUri: string) {
    if (!connectionUri) throw new Error('Couldn\'t instantiate SoundsService: connectionUri must be provided');

    this.soundsCollection = new MongoClient(connectionUri).connect().then(x => x.db('botman').collection('sounds'));
  }

  async getSound(name: string): Promise<Sound | null> {
    const collection = await this.soundsCollection;
    const document = await collection.findOne({ name }, ReadOnlySoundsService.soundFindOptions);

    if (!document) return null;

    return ReadOnlySoundsService.mapSoundDocumentToSound(document);
  }

  getAllSounds(): Promise<Sound[]> {
    return this.find();
  }

  searchSounds(searchTerm: string): Promise<Sound[]> {
    return this.find({ name: new RegExp(`^${ searchTerm }`, 'i') });
  }

  private async find(filter: Filter<SoundDocument> = {}): Promise<Sound[]> {
    const collection = await this.soundsCollection;
    return collection.find(filter, ReadOnlySoundsService.soundFindOptions).sort({ name: 1 }).map(ReadOnlySoundsService.mapSoundDocumentToSound).toArray();
  }

  private static mapSoundDocumentToSound(document: SoundDocument): Sound {
    return {
      name: document.name,
      file: ReadOnlySoundsService.mapFileNameToSoundFile(document.fileName),
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

export class SoundsService extends ReadOnlySoundsService {
  private readonly filesService: FilesService;

  constructor(connectionUri: string, filesPath: string) {
    super(connectionUri);

    if (!filesPath) throw new Error('Couldn\'t instantiate SoundsService: filesPath must be provided');

    this.filesService = new FilesService(filesPath);
  }

  async addSound({ name, fileName, fileStream }: AddSoundOptions): Promise<void> {
    try {
      await this.filesService.saveFile(fileName, fileStream);
    } catch (error: any) {
      if (error.code === 'EEXIST')
        throw new Error(errors.soundAlreadyExists);

      throw error;
    }

    try {
      const collection = await this.soundsCollection;
      await collection.insertOne({ name, fileName });
    } catch (error) {
      await this.filesService.deleteFile(fileName);
      throw error;
    }
  }
}
