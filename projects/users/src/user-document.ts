import { Tag } from './tag';

export interface SortPrefs {
  sortOrder: string;
  tagGroups: string;
}

export interface ThemePrefs {
  theme?: string;
  useSeasonal: boolean;
}

export interface UserDocument {
  userId: string;
  role: string;
  favorites: string[];
  tags: Tag[];
  sortPrefs: SortPrefs;
  themePrefs: ThemePrefs;
  introSound?: string;
}
