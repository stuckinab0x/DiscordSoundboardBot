import { BlobServiceClient, BlockBlobClient, ContainerClient } from '@azure/storage-blob';
import { Readable } from 'node:stream';
import { SaveableSoundFile } from './saveable-sound-file';

export class FilesService {
  private readonly soundsContainerClient: ContainerClient;

  constructor(blobStorageConnectionString: string) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(blobStorageConnectionString);
    this.soundsContainerClient = blobServiceClient.getContainerClient('sounds');
  }

  async saveFile(name: string, file: SaveableSoundFile, mimeType: string): Promise<void> {
    const blockBlobClient = await this.getBlockBlobClient(name);

    if (file instanceof Readable)
      await blockBlobClient.uploadStream(file);
    else
      await blockBlobClient.uploadData(file);

    await blockBlobClient.setHTTPHeaders({ blobContentType: mimeType });
  }

  async deleteFile(name: string): Promise<void> {
    const blockBlobClient = await this.getBlockBlobClient(name);
    await blockBlobClient.delete();
  }

  private async getBlockBlobClient(name: string): Promise<BlockBlobClient> {
    await this.soundsContainerClient.createIfNotExists({ access: 'blob' });
    return this.soundsContainerClient.getBlockBlobClient(name);
  }
}
