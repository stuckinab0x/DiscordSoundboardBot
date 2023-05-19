import { UsersService } from './users-service';
import { SortPrefs } from './user-document';

export class PrefsService extends UsersService {
  async getSortPrefs(userId: string): Promise<SortPrefs> {
    const collection = await this.usersCollection;
    const user = await collection.findOne({ userId }, { projection: { sortPrefs: 1, groupPrefs: 1 } });

    return { sortOrder: user?.sortPrefs.sortOrder || 'A-Z', tagGroups: user?.sortPrefs.tagGroups || 'none' };
  }

  async setSortPrefs(userId: string, sortPrefs: SortPrefs): Promise<void> {
    const collection = await this.usersCollection;
    await collection.updateOne({ userId }, { $set: { 'sortPrefs.sortOrder': sortPrefs.sortOrder, 'sortPrefs.tagGroups': sortPrefs.tagGroups } }, { upsert: true });
  }

  async getUserRole(userId: string): Promise<string | undefined> {
    const collection = await this.usersCollection;
    const user = await collection.findOne({ userId }, { projection: { role: 1 } });
    return user?.role;
  }
}
