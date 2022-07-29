import { Db, MongoClient } from 'mongodb';

export abstract class MongoService {
  private static connectionUri: string;
  private static db: Promise<Db>;

  protected readonly db: Promise<Db>;

  protected constructor(connectionUri: string) {
    if (!connectionUri) throw new Error(`Couldn't instantiate ${ this.constructor.name }: connectionUri must be provided`);

    if (MongoService.connectionUri && MongoService.connectionUri !== connectionUri)
      throw new Error(`Couldn't instantiate ${ this.constructor.name }: connectionUri may not be changed once set`);

    if (!MongoService.db) {
      MongoService.connectionUri = connectionUri;
      MongoService.db = new MongoClient(connectionUri).connect().then(client => client.db('botman'));
    }

    this.db = MongoService.db;
  }
}
