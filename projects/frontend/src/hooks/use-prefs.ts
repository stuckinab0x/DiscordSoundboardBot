import cookies from 'js-cookie';
import { SortOrder, GroupOrder } from '../models/sort-rules';

const prefs = {
  sort: cookies.get('sortpref')!,
  groups: cookies.get('groupspref')!,
};

interface Prefs {
  sortOrder: SortOrder;
  groupOrder: GroupOrder;
}

const usePrefs = (): Prefs => {
  if (!prefs.groups || !prefs.sort)
    throw new Error();
  return {
    sortOrder: prefs.sort as SortOrder,
    groupOrder: prefs.groups as GroupOrder,
  };
};

export default usePrefs;
