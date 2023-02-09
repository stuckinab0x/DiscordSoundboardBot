import { Tag } from './tag';

export interface UserDocument {
  userId: string;
  role: string;
  favorites: string[];
  tags: Tag[];
  sortPrefs: {
    sortOrder: string;
    tagGroups: string;
  }
}
