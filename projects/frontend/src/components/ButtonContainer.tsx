import React, { FC, useCallback } from 'react';
import useSWR from 'swr';
import styled, { useTheme } from 'styled-components';
import debounce from '../utils';
import SoundTile from './SoundTile';
import Sound from '../models/sound';
import FullMoon from './decorative/FullMoon';
import CustomTag from '../models/custom-tag';
import TagProps from '../models/tag-props';
import SortRules from '../models/sort-rules';

const ButtonContainerMain = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0;
  padding: 10px 15px 0px;
  position: relative;
  z-index: 0;

  @media only screen and (max-width: 780px) {
    padding: 8px 0px;
    margin: 0px 8px;
  }
`;

function sortByOrder(sounds: Sound[], sortOrder: string) {
  const soundList = [...sounds];
  if (sortOrder === 'A-Z') return soundList;

  const compareFn = (a: Sound, b: Sound) => {
    if (sortOrder === 'Date - New') return a.date > b.date ? -1 : 1;
    return a.date < b.date ? -1 : 1;
  };

  return soundList.sort(compareFn);
}

function sortSoundGroups(sounds: Sound[], sortMode: string, groupMode: string, customTags: CustomTag[]) {
  const soundList = [...sounds];

  if (groupMode === 'none') return sortByOrder(soundList, sortMode);

  const idsGroupedByTag = customTags.map(x => [...x.sounds]);

  const allTaggedSoundsGrouped = idsGroupedByTag.reduce((groupedList, group) => {
    const total = [...groupedList];
    group.forEach(sound => {
      const soundButton = soundList.find(x => x.id === sound);
      if (soundButton) total.push(soundButton);
    });
    return sortByOrder(total, sortMode);
  }, new Array<Sound>());

  const allTagged = idsGroupedByTag.flat();

  const unTagged = sortByOrder(soundList.filter(x => !allTagged.includes(x.id)), sortMode);

  if (groupMode === 'start') return [...allTaggedSoundsGrouped, ...unTagged];
  return [...unTagged, ...allTaggedSoundsGrouped];
}

interface ButtonContainerProps {
  preview: boolean;
  previewRequest: (soundName: string) => void;
  sortRules: SortRules;
  customTags: CustomTag[];
  currentlyTagging: TagProps | null;
  unsavedTagged: string[];
  toggleSoundOnTag: (soundId: string) => void;
}

const ButtonContainer: FC<ButtonContainerProps> = ({
  preview,
  previewRequest,
  sortRules: { favorites, small, searchTerm, sortOrder, groups, tags },
  customTags,
  currentlyTagging,
  unsavedTagged,
  toggleSoundOnTag,
}) => {
  const { data: sounds, error, mutate: mutateSounds } = useSWR<Sound[]>('/api/sounds');
  const theme = useTheme();

  const soundRequest = useCallback(debounce(async (soundId: string, borderCallback: () => void) => {
    borderCallback();
    const res = await fetch(`/api/sounds/${ soundId }`);
    if (res.status === 401)
      window.location.reload();
  }, 2000, true), []);

  const updateFavoritesRequest = useCallback((soundName: string) => {
    if (sounds) {
      const sound = sounds.find(x => x.name === soundName);
      if (sound) {
        const newSounds = [...sounds];
        const soundIndex = newSounds.findIndex(x => x.id === sound?.id);
        newSounds[soundIndex] = { ...(sound), isFavorite: !sound?.isFavorite };
        const updateFav = async () => {
          await fetch(`/api/favorites/${ sound?.id }`, { method: sound?.isFavorite ? 'DELETE' : 'PUT' });
          return newSounds;
        };
        mutateSounds(updateFav(), { optimisticData: newSounds, rollbackOnError: true });
      }
    }
  }, [sounds]);

  if (sounds)
    return (
      <ButtonContainerMain>
        { theme.name === 'halloween' && <FullMoon /> }
        { sortSoundGroups(sounds, sortOrder, groups, customTags).map(x => {
          let tagColor;
          const savedTag = customTags.find(tag => tag.sounds.includes(x.id));
          if (savedTag && savedTag?.id !== currentlyTagging?.id && unsavedTagged.includes(x.id)) tagColor = currentlyTagging?.color;
          else if (savedTag && savedTag?.id !== currentlyTagging?.id) tagColor = savedTag?.color;
          else if (unsavedTagged.includes(x.id)) tagColor = currentlyTagging?.color;

          if (tags.length && (!savedTag || !tags.includes(savedTag.id))) return null;
          if (favorites && !x.isFavorite) return null;
          if (searchTerm && !x.name.toUpperCase().includes(searchTerm)) return null;

          return (
            <SoundTile
              key={ x.id }
              preview={ preview }
              small={ small }
              sound={ x }
              soundRequest={ soundRequest }
              previewRequest={ previewRequest }
              tagColor={ tagColor }
              updateFavRequest={ updateFavoritesRequest }
              currentlyTagging={ !!currentlyTagging }
              unsavedTagged={ unsavedTagged }
              toggleSoundOnTag={ toggleSoundOnTag }
            />
          );
        })}
      </ButtonContainerMain>
    );

  return (
    <ButtonContainerMain>
      { error ? <h1>Something broke eeeeeek</h1> : <h1>Loading yo sounds...</h1> }
    </ButtonContainerMain>
  );
};

export default ButtonContainer;
