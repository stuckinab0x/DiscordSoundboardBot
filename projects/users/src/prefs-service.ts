import { UsersService } from './users-service';

export class PrefsService extends UsersService {
  async getSortOrderPref(userId: string): Promise<string> {
    const collection = await this.usersCollection;
    const user = await collection.findOne({ userId }, { projection: { sortPrefs: 1 } });
    return user?.sortPrefs?.sortOrder ?? 'A-Z';
  }

  async setSortOrderPref(userId: string, sortOrder: string): Promise<void> {
    const collection = await this.usersCollection;
    await collection.updateOne({ userId }, { $set: { 'sortPrefs.sortOrder': sortOrder } }, { upsert: true });
  }

  async getGroupsPref(userId: string): Promise<string> {
    const collection = await this.usersCollection;
    const user = await collection.findOne({ userId }, { projection: { sortPrefs: 1 } });
    return user?.sortPrefs?.tagGroups ?? 'none';
  }

  async setGroupsPref(userId: string, groups: string): Promise<void> {
    const collection = await this.usersCollection;
    await collection.updateOne({ userId }, { $set: { 'sortPrefs.tagGroups': groups } }, { upsert: true });
  }
}
