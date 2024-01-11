import React, { FC, createContext, useContext, useCallback, useState, useMemo, ReactNode, SetStateAction } from 'react';
import cookies from 'js-cookie';
import SortRules, { GroupOrder, SortOrder } from '../models/sort-rules';
import useInitialSortRules from '../hooks/use-initial-sort-rules';
import { getSeasonalThemeName } from '../utils';

interface ThemePrefs {
  theme: string;
  useSeasonal: boolean;
}

const getInitialTheme = (): ThemePrefs => {
  const prefs = {
    theme: cookies.get('theme')!,
    useSeasonal: !!(cookies.get('useSeasonal')! === 'true'),
  };

  let { theme } = prefs;

  if (prefs.useSeasonal && theme === 'Classic')
    theme = getSeasonalThemeName();
  return {
    theme,
    useSeasonal: prefs.useSeasonal,
  };
};

interface PrefsContextProps {
  themePrefs: ThemePrefs;
  setThemePrefs: React.Dispatch<SetStateAction<ThemePrefs>>;
  showThemePicker: boolean;
  setShowThemePicker: (show: boolean) => void;
  sortRules: SortRules;
  toggleSmallButtons: () => void;
  toggleFavs: () => void;
  updateSearchTerm: (searchTerm: string) => void;
  toggleSoundSortOrder: () => Promise<void>;
  toggleSoundGrouping: () => Promise<void>;
  toggleTagFilter: (tagId: string) => void;
  saveTheme: (themeName: string, useSeasonal: boolean) => Promise<void>;
}

const PrefsContext = createContext<PrefsContextProps | null>(null);

export const usePrefs = () => {
  const prefsContext = useContext(PrefsContext);

  if (!prefsContext)
    throw new Error(
      'usePrefs has to be used within <PrefsProvider>',
    );

  return prefsContext;
};

interface PrefsProviderProps {
  children: ReactNode;
}

const PrefsProvider: FC<PrefsProviderProps> = ({ children }) => {
  const [themePrefs, setThemePrefs] = useState<ThemePrefs>(getInitialTheme());
  const [showThemePicker, setShowThemePicker] = useState(false);

  const initialSortRules = useInitialSortRules();

  const [sortRules, setSortRules] = useState<SortRules>({
    favorites: false,
    small: false,
    searchTerm: '',
    sortOrder: initialSortRules.sortOrder,
    groupOrder: initialSortRules.groupOrder,
    tags: new Array<string>(),
  });

  const toggleSmallButtons = useCallback(() => {
    setSortRules(oldState => ({ ...oldState, small: !oldState.small }));
  }, [sortRules.small]);

  const toggleFavs = useCallback(() => {
    setSortRules(oldState => ({ ...oldState, favorites: !oldState.favorites }));
  }, [sortRules.favorites]);

  const updateSearchTerm = useCallback((searchTerm: string) => {
    setSortRules(oldState => ({ ...oldState, searchTerm }));
  }, [sortRules.searchTerm]);

  const saveTheme = useCallback(async (themeName: string, useSeasonal: boolean) => {
    await fetch('/api/prefs/', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ themeName, useSeasonal }),
    });
  }, []);

  const saveSortPrefs = useCallback(async (sortOrder: string, groupOrder: string) => {
    await fetch('/api/prefs/', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sortOrder, groupOrder }),
    });
  }, []);

  const toggleSoundSortOrder = useCallback(async () => {
    let newOrder: SortOrder = 'A-Z';
    if (sortRules.sortOrder === 'A-Z') newOrder = 'Date - New';
    else if (sortRules.sortOrder === 'Date - New') newOrder = 'Date - Old';
    setSortRules(oldState => ({ ...oldState, sortOrder: newOrder }));
    saveSortPrefs(newOrder, sortRules.groupOrder);
  }, [sortRules]);

  const toggleSoundGrouping = useCallback(async () => {
    let newMode: GroupOrder = 'none';
    if (sortRules.groupOrder === 'none') newMode = 'start';
    if (sortRules.groupOrder === 'start') newMode = 'end';
    setSortRules(oldState => ({ ...oldState, groupOrder: newMode }));
    saveSortPrefs(sortRules.sortOrder, newMode);
  }, [sortRules]);

  const toggleTagFilter = useCallback((tagId: string) => {
    const newTagRules = [...sortRules.tags];
    const index = newTagRules.indexOf(tagId);
    if (index >= 0) newTagRules.splice(index, 1);
    else newTagRules.push(tagId);
    setSortRules(oldState => ({ ...oldState, tags: newTagRules }));
  }, [sortRules.tags]);

  const context = useMemo(() => ({
    themePrefs,
    setThemePrefs,
    showThemePicker,
    setShowThemePicker,
    sortRules,
    toggleSmallButtons,
    toggleFavs,
    updateSearchTerm,
    toggleSoundSortOrder,
    toggleSoundGrouping,
    toggleTagFilter,
    saveTheme,
  }), [
    themePrefs,
    setThemePrefs,
    showThemePicker,
    setShowThemePicker,
    sortRules,
    toggleSmallButtons,
    toggleFavs,
    updateSearchTerm,
    toggleSoundSortOrder,
    toggleSoundGrouping,
    toggleTagFilter,
    saveTheme,
  ]);

  return (
    <PrefsContext.Provider value={ context }>
      { children }
    </PrefsContext.Provider>
  );
};

export default PrefsProvider;
