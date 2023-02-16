export type SortOrder = 'A-Z' | 'Date - New' | 'Date - Old';
export type GroupOrder = 'none' | 'start' | 'end';

export default interface SortRules {
  favorites: boolean;
  small: boolean;
  searchTerm: string,
  sortOrder: SortOrder
  groupOrder: GroupOrder
  tags: string[];
}
