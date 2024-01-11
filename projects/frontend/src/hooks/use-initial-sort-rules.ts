import cookies from 'js-cookie';
import { SortOrder, GroupOrder } from '../models/sort-rules';

const prefs = {
  sort: cookies.get('sortpref')!,
  groups: cookies.get('groupspref')!,
};

interface SortRules {
  sortOrder: SortOrder;
  groupOrder: GroupOrder;
}

const useInitialSortRules = (): SortRules => {
  if (!prefs.groups || !prefs.sort)
    throw new Error();
  return {
    sortOrder: prefs.sort as SortOrder,
    groupOrder: prefs.groups as GroupOrder,
  };
};

export default useInitialSortRules;
