import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import styled, { useTheme } from 'styled-components';
import { debounce } from '../utils';
import SoundTile from './SoundTile';
import Sound from '../models/sound';
import FullMoon from './decorative/FullMoon';
import CustomTag from '../models/custom-tag';
import { usePrefs } from '../contexts/prefs-context';
import { useCustomTags } from '../contexts/custom-tags-context';
import { GroupOrder, SortOrder } from '../models/sort-rules';

const ContainerMain = styled.div`
  display: flex;
  flex-direction: column;
`;

const Buttons = styled.div`
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

const IntroError = styled.div`
  display: flex;
  justify-content: center;
  color: white;

  > h2 {
    margin: 0;
    padding: 10px;
    border-radius: 10px;
    border: 2px solid ${ props => props.theme.colors.accent };
    background-color: ${ props => props.theme.colors.innerA };
    cursor: pointer;
    opacity: 0.7;

    &:hover {
      opacity: 1;
    }
  }
`;

function sortByDate(sounds: Sound[], sortOrder: SortOrder) {
  if (sortOrder === 'A-Z') return sounds;

  const compareFn = (a: Sound, b: Sound) => {
    if (sortOrder === 'Date - New') return a.date > b.date ? -1 : 1;
    return a.date < b.date ? -1 : 1;
  };

  return [...sounds].sort(compareFn);
}

function sortSoundGroups(sounds: Sound[], groupOrder: GroupOrder, customTags: CustomTag[]) {
  if (groupOrder === 'none') return sounds;

  const allTagged = customTags.flatMap(tag => sounds.filter(x => tag.sounds.includes(x.id)));
  const unTagged = sounds.filter(x => !allTagged.includes(x));

  return groupOrder === 'start' ? [...allTagged, ...unTagged] : [...unTagged, ...allTagged];
}

interface ButtonContainerProps {
  soundPreview: (soundId: string, volumeOffset?: number) => Promise<void>;
}

const ButtonContainer: FC<ButtonContainerProps> = ({ soundPreview }) => {
  const { data: soundsData, error, mutate: mutateSounds } = useSWR<{ introSound: string | undefined, sounds: Sound[] }>('/api/sounds');
  const { data: customTags } = useSWR<CustomTag[]>('/api/tags');

  const { name: themeName } = useTheme();
  const { sortRules: { favorites, small, searchTerm, sortOrder, groupOrder, tags }, showThemePicker } = usePrefs();
  const { currentlyTagging, unsavedTagged } = useCustomTags();

  const [showIntroError, setShowIntroError] = useState(false);

  useEffect(() => {
    if (soundsData?.introSound && soundsData.sounds.every(x => x.id !== soundsData.introSound))
      setShowIntroError(true);
  }, [soundsData]);

  const soundRequest = useCallback(debounce(async (soundId: string, borderCallback: () => void) => {
    borderCallback();
    const res = await fetch(`/api/queue/${ soundId }`, { method: 'POST' });
    if (res.status === 401)
      window.location.reload();
  }, 2000, true), []);

  const updateFavoritesRequest = useCallback((soundId: string) => {
    if (!soundsData)
      return;
    const soundIndex = soundsData.sounds.findIndex(x => x.id === soundId);
    if (soundIndex === -1)
      return;
    const sound = soundsData.sounds[soundIndex];
    const newSounds: Sound[] = [...soundsData.sounds.slice(0, soundIndex), { ...sound, isFavorite: !sound.isFavorite }, ...soundsData.sounds.slice(soundIndex + 1)];
    const updateFav = async () => {
      await fetch(
        '/api/favorites',
        {
          method: sound?.isFavorite ? 'DELETE' : 'POST',
          body: JSON.stringify({ soundId: sound.id }),
          headers: { 'Content-Type': 'application/json' },
        },
      );
      return { introSound: soundsData.introSound, sounds: newSounds };
    };
    mutateSounds(updateFav(), { optimisticData: { introSound: soundsData.introSound, sounds: newSounds }, rollbackOnError: true });
  }, [soundsData]);

  const updateMySound = useCallback((soundId: string) => {
    if (soundsData) {
      const updateIntroSound = async () => {
        await fetch(`/api/prefs/${ soundId }`, { method: 'PUT' });
        return { introSound: soundId === soundsData.introSound ? undefined : soundId, sounds: soundsData.sounds };
      };
      mutateSounds(updateIntroSound(), { optimisticData: { introSound: soundId === soundsData.introSound ? undefined : soundId, sounds: soundsData.sounds }, rollbackOnError: true });
    }
  }, [soundsData]);

  const handleDismissIntroError = useCallback(() => {
    updateMySound(soundsData?.introSound!);
    setShowIntroError(false);
  }, [soundsData?.introSound, updateMySound]);

  const orderedSounds = useMemo(() => {
    if (!soundsData?.sounds || !customTags)
      return null;
    return sortSoundGroups(sortByDate(soundsData.sounds, sortOrder), groupOrder, customTags);
  }, [soundsData?.sounds, sortOrder, groupOrder, customTags]);

  if (orderedSounds && !orderedSounds.length)
    return (
      <Buttons>
        <h1>There are no sounds, except a cricket that has snuck into the database.</h1>
      </Buttons>
    );

  if (orderedSounds && customTags)
    return (
      <ContainerMain>
        { showIntroError && (
        <IntroError onClick={ handleDismissIntroError }>
          <h2>your intro sound got deleted, sorry buddy (click to dismiss)</h2>
        </IntroError>
        ) }
        <Buttons>
          { themeName === 'Halloween' && <FullMoon /> }
          { orderedSounds.map(x => {
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
                small={ small }
                isIntroSound={ x.id === soundsData?.introSound }
                sound={ x }
                soundRequest={ soundRequest }
                soundPreview={ () => soundPreview(x.url, x.volume) }
                tagColor={ tagColor }
                updateFavRequest={ () => updateFavoritesRequest(x.id) }
                updateMySound={ () => updateMySound(x.id) }
                currentlyTagging={ !!currentlyTagging }
                unsavedTagged={ unsavedTagged }
                disableBorder={ showThemePicker }
              />
            );
          })}
        </Buttons>
      </ContainerMain>
    );

  return (
    <Buttons>
      { error ? <h1>Something broke eeeeeek</h1> : <h1>Loading yo sounds...</h1> }
    </Buttons>
  );
};

export default ButtonContainer;
