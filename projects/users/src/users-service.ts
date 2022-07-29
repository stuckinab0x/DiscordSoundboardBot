import { Collection } from 'mongodb';
import { MongoService } from 'botman-mongo';
import { UserDocument } from './user-document';

export class UsersService extends MongoService {
  protected readonly usersCollection: Promise<Collection<UserDocument>>;

  constructor(connectionUri: string) {
    super(connectionUri);

    this.usersCollection = this.db.then(db => db.collection('users'));
  }
}
