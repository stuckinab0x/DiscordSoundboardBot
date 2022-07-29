import { Collection, Filter, ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import sanitize from 'sanitize-filename';
import fileType, { FileTypeResult } from 'file-type';
import { Readable } from 'node:stream';
import { MongoService } from 'botman-mongo';
import { Sound, SoundFile } from './sound';
import { SoundDocument } from './sound-document';
import { FilesService } from './files-service';
import { errors } from './errors';
import { SaveableSoundFile } from './saveable-sound-file';

export interface AddSoundOptions {
  name: string;
  file: SaveableSoundFile;
}

export class ReadOnlySoundsService extends MongoService {
  protected readonly soundsCollection: Promise<Collection<SoundDocument>>;

  constructor(connectionUri: string) {
    super(connectionUri);

    this.soundsCollection = this.db.then(db => db.collection('sounds'));
  }

  async getSound(name: string): Promise<Sound | null> {
    const collection = await this.soundsCollection;
    const document = await collection.findOne({ name });

    if (!document) return null;

    return ReadOnlySoundsService.mapSoundDocumentToSound(document);
  }

  getAllSounds(): Promise<Sound[]> {
    return this.find();
  }

  searchSounds(searchTerm: string): Promise<Sound[]> {
    return this.find({ name: new RegExp(searchTerm, 'i') });
  }

  private async find(filter: Filter<SoundDocument> = {}): Promise<Sound[]> {
    const collection = await this.soundsCollection;

    return collection
      .find(filter, { collation: { locale: 'en', strength: 2 } })
      .sort({ name: 1 })
      .map(ReadOnlySoundsService.mapSoundDocumentToSound)
      .toArray();
  }

  private static mapSoundDocumentToSound(document: SoundDocument): Sound {
    return {
      id: document._id.toString(),
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

interface FileTypeResultWrapper<T extends Readable | Buffer> {
  fileTypeResult?: FileTypeResult;
  file: T;
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
    const { fileTypeResult, file: cleanFile } = file instanceof Readable ? await SoundsService.determineStreamFileType(file) : await SoundsService.determineBufferFileType(file);

    if (!fileTypeResult || SoundsService.validFileExtensions.indexOf(fileTypeResult.ext) === -1)
      throw new Error(errors.unsupportedFileExtension);

    const uniqueFileName = `${ sanitize(name) }.${ uuidv4() }.${ fileTypeResult.ext }`;

    await this.filesService.saveFile(uniqueFileName, cleanFile, fileTypeResult.mime);

    try {
      const collection = await this.soundsCollection;
      await collection.insertOne({ _id: new ObjectId(), name, fileName: uniqueFileName });
    } catch (error: any) {
      await this.filesService.deleteFile(uniqueFileName);

      if (error.code === 11000)
        throw new Error(errors.soundAlreadyExists);

      throw error;
    }
  }

  private static async determineStreamFileType(stream: Readable): Promise<FileTypeResultWrapper<Readable>> {
    const streamWithFileType = await fileType.stream(stream);
    const fileTypeResult = streamWithFileType.fileType;

    return {
      file: streamWithFileType,
      fileTypeResult,
    };
  }

  private static async determineBufferFileType(buffer: Buffer): Promise<FileTypeResultWrapper<Buffer>> {
    const fileTypeResult = await fileType.fromBuffer(buffer);

    return {
      file: buffer,
      fileTypeResult,
    };
  }
}
