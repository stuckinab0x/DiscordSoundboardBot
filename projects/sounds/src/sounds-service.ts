import { Collection, Filter, FindOptions, MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import sanitize from 'sanitize-filename';
import fileType from 'file-type';
import { Readable } from 'node:stream';
import { Sound, SoundFile } from './sound';
import { SoundDocument } from './sound-document';
import { FilesService } from './files-service';
import { errors } from './errors';
import { SaveableSoundFile } from './saveable-sound-file';

export interface AddSoundOptions {
  name: string;
  file: SaveableSoundFile;
}

export class ReadOnlySoundsService {
  private static readonly soundFindOptions: FindOptions<SoundDocument> = { projection: { _id: 0 } };

  protected readonly soundsCollection: Promise<Collection<SoundDocument>>;
  private readonly mongoClient: MongoClient;

  constructor(connectionUri: string) {
    if (!connectionUri) throw new Error('Couldn\'t instantiate SoundsService: connectionUri must be provided');

    this.mongoClient = new MongoClient(connectionUri);
    this.soundsCollection = this.mongoClient.connect().then(x => x.db('botman').collection('sounds'));
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

  close(): Promise<void> {
    return this.mongoClient.close();
  }

  private async find(filter: Filter<SoundDocument> = {}): Promise<Sound[]> {
    const collection = await this.soundsCollection;

    return collection
      .find(filter, { ...ReadOnlySoundsService.soundFindOptions, collation: { locale: 'en', strength: 2 } })
      .sort({ name: 1 })
      .map(ReadOnlySoundsService.mapSoundDocumentToSound)
      .toArray();
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
  private static readonly validFileExtensions = ['wav', 'mp3', 'webm', 'ogg'];

  private readonly filesService: FilesService;

  constructor(connectionUri: string, blobStorageConnectionString: string) {
    super(connectionUri);

    if (!blobStorageConnectionString) throw new Error('Couldn\'t instantiate SoundsService: blobStorageConnectionString must be provided');

    this.filesService = new FilesService(blobStorageConnectionString);
  }

  async addSound({ name, file }: AddSoundOptions): Promise<void> {
    const fileTypeResult = file instanceof Readable ? await fileType.fromStream(file) : await fileType.fromBuffer(file);

    if (!fileTypeResult || SoundsService.validFileExtensions.indexOf(fileTypeResult.ext) === -1)
      throw new Error(errors.unsupportedFileExtension);

    const uniqueFileName = `${ sanitize(name) }.${ uuidv4() }.${ fileTypeResult.ext }`;

    await this.filesService.saveFile(uniqueFileName, file);

    try {
      const collection = await this.soundsCollection;
      await collection.insertOne({ name, fileName: uniqueFileName });
    } catch (error: any) {
      await this.filesService.deleteFile(uniqueFileName);

      if (error.code === 11000)
        throw new Error(errors.soundAlreadyExists);

      throw error;
    }
  }
}
