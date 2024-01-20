import { FC, useCallback, useState, useMemo, createContext, useContext, ReactNode } from 'react';
import useSWR from 'swr';
import CustomTag from '../models/custom-tag';
import TagProps from '../models/tag-props';

interface CustomTagsContextProps {
  showCustomTagPicker: boolean;
  toggleShowCustomTagPicker: () => void;
  editingTag: boolean;
  setEditingTag: (disable: boolean) => void;
  unsavedTagged: string[];
  currentlyTagging: TagProps | null;
  beginTagging: (tagId: string) => void;
  toggleSoundOnTag: (soundId: string) => void;
  saveTagged: () => Promise<void>;
  discardTagged: () => void;
}

const CustomTagsContext = createContext<CustomTagsContextProps | null>(null);

export const useCustomTags = () => {
  const customTagsContext = useContext(CustomTagsContext);

  if (!customTagsContext)
    throw new Error(
      'useCustomTags has to be used within <CustomTagsProvider>',
    );

  return customTagsContext;
};

interface CustomTagsProviderProps {
  children: ReactNode;
}

const CustomTagsProvider: FC<CustomTagsProviderProps> = ({ children }) => {
  const { data: customTags, mutate } = useSWR<CustomTag[]>('/api/tags');

  const [unsavedTagged, setUnsavedTagged] = useState<string[]>([]);
  const [currentlyTagging, setCurrentlyTagging] = useState<TagProps | null>(null);
  const [showCustomTagPicker, setShowCustomTagPicker] = useState(false);
  const toggleShowCustomTagPicker = useCallback(() => {
    setShowCustomTagPicker(!showCustomTagPicker);
  }, [showCustomTagPicker]);
  const [editingTag, setEditingTag] = useState(false);

  const beginTagging = useCallback((tagId: string) => {
    if (customTags) {
      const tag = customTags.find(x => x.id === tagId);
      if (tag) {
        setUnsavedTagged([...tag.sounds]);
        setShowCustomTagPicker(false);
        setCurrentlyTagging(tag);
        setEditingTag(true);
      }
    }
  }, [customTags]);

  const toggleSoundOnTag = useCallback((soundId: string) => {
    const found = unsavedTagged.find(x => x === soundId);
    setUnsavedTagged(oldState => found ? [...oldState.filter(x => x !== soundId)] : [...oldState, soundId]);
  }, [unsavedTagged]);

  const saveTagged = useCallback(async () => {
    if (!customTags || !currentlyTagging) return;
    const tagIndex = customTags.findIndex(x => x.id === currentlyTagging?.id);
    if (tagIndex === -1)
      return;
    const oldTagSounds = [...customTags[tagIndex].sounds];
    const added = unsavedTagged.filter(x => !oldTagSounds.includes(x));
    const deleted = [
      ...unsavedTagged.filter(x => customTags.filter(tag => tag.id !== currentlyTagging.id).find(tag => tag.sounds.includes(x))),
      ...oldTagSounds.filter(x => !unsavedTagged.includes(x)),
    ];

    const newTags = customTags.filter(x => x.id !== currentlyTagging.id).map(x => ({ ...x, sounds: x.sounds.filter(sound => !added.includes(sound)) }));
    newTags.splice(tagIndex, 0, { id: currentlyTagging.id, name: currentlyTagging.name, color: currentlyTagging.color, sounds: unsavedTagged });

    const updateTagSounds = async () => {
      const body = { added, deleted };
      await fetch(`/api/tags/${ currentlyTagging.id }/sounds`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      return newTags;
    };
    mutate(updateTagSounds(), { optimisticData: newTags, rollbackOnError: true });
    setCurrentlyTagging(null);
    setUnsavedTagged([]);
    setEditingTag(false);
  }, [customTags, currentlyTagging, unsavedTagged]);

  const discardTagged = useCallback(() => {
    setCurrentlyTagging(null);
    setUnsavedTagged([]);
    setEditingTag(false);
  }, []);

  const context = useMemo<CustomTagsContextProps>(() => ({
    showCustomTagPicker,
    toggleShowCustomTagPicker,
    editingTag,
    setEditingTag,
    unsavedTagged,
    currentlyTagging,
    beginTagging,
    toggleSoundOnTag,
    saveTagged,
    discardTagged,
  }), [showCustomTagPicker, toggleShowCustomTagPicker, editingTag, setEditingTag, unsavedTagged, currentlyTagging, beginTagging, toggleSoundOnTag, saveTagged, discardTagged]);

  return (
    <CustomTagsContext.Provider value={ context }>
      { children }
    </CustomTagsContext.Provider>
  );
};

export default CustomTagsProvider;
