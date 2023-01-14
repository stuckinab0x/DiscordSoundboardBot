import { useState, useCallback } from 'react';
import SortRules from '../models/sort-rules';
import usePrefs from './use-prefs';

export default function useSortRules() {
  const prefs = usePrefs();

  const [sortRules, setSortRules] = useState<SortRules>({ favorites: false, small: false, searchTerm: '', sortOrder: prefs.sort, groups: prefs.groups, tags: new Array<string>() });

  const toggleSmallButtons = useCallback(() => {
    setSortRules(oldState => ({ ...oldState, small: !oldState.small }));
  }, [sortRules.small]);

  const toggleFavs = useCallback(() => {
    setSortRules(oldState => ({ ...oldState, favorites: !oldState.favorites }));
  }, [sortRules.favorites]);

  const setSearchTerm = useCallback((searchTerm: string) => {
    setSortRules(oldState => ({ ...oldState, searchTerm }));
  }, [sortRules.searchTerm]);

  const toggleSoundSortOrder = useCallback(async () => {
    let newOrder = 'A-Z';
    if (sortRules.sortOrder === 'A-Z') newOrder = 'Date - New';
    else if (sortRules.sortOrder === 'Date - New') newOrder = 'Date - Old';
    setSortRules(oldState => ({ ...oldState, sortOrder: newOrder }));
    await fetch(`/api/prefs/setsortorder/${ newOrder }`, { method: 'PUT' });
  }, [sortRules.sortOrder]);

  const toggleSoundGrouping = useCallback(async () => {
    let newMode = 'none';
    if (sortRules.groups === 'none') newMode = 'start';
    if (sortRules.groups === 'start') newMode = 'end';
    setSortRules(oldState => ({ ...oldState, groups: newMode }));
    await fetch(`/api/prefs/setgroups/${ newMode }`, { method: 'PUT' });
  }, [sortRules.groups]);

  const toggleTagFilter = useCallback((tagId: string) => {
    const newTagRules = [...sortRules.tags];
    const index = newTagRules.indexOf(tagId);
    if (index >= 0) newTagRules.splice(index, 1);
    else newTagRules.push(tagId);
    setSortRules(oldState => ({ ...oldState, tags: newTagRules }));
  }, [sortRules.tags]);

  return { sortRules, toggleSmallButtons, toggleFavs, setSearchTerm, toggleSoundSortOrder, toggleSoundGrouping, toggleTagFilter };
}
