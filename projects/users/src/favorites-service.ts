import { UsersService } from './users-service';

export interface FavoriteUpdateOptions {
  userId: string;
  soundId: string;
}

export class FavoritesService extends UsersService {
  async addToFavorites(options: FavoriteUpdateOptions): Promise<void> {
    const collection = await this.usersCollection;
    await collection.updateOne({ userId: options.userId }, { $addToSet: { favorites: options.soundId } }, { upsert: true });
  }

  async removeFromFavorites(options: FavoriteUpdateOptions): Promise<void> {
    const collection = await this.usersCollection;
    await collection.updateOne({ userId: options.userId }, { $pull: { favorites: options.soundId } });
  }

  async getFavorites(userId: string): Promise<string[]> {
    const collection = await this.usersCollection;
    const user = await collection.findOne({ userId }, { projection: { favorites: 1 } });
    return user?.favorites ?? [];
  }
}
