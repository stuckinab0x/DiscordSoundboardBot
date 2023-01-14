import React, { FC, useCallback, useState } from 'react';
import styled, { css, useTheme } from 'styled-components';
import * as mixins from '../styles/mixins';
import Sound from '../models/sound';

interface SoundTileMainProps {
  preview: boolean;
  statusBorder: string;
  small: boolean;
  isFavorite: boolean;
  tagColor: string | null;
}

const soundTileSmall = css`
  font-size: 0.6rem;
  border: 2px solid ${ props => props.theme.colors.borderDefault };
  border-radius: 2px;
  min-width: 75px;
  min-height: 75px;
  max-width: 75px;
  margin: 4px 4px;
`;

const soundTileSmallMobile = css`
    font-size: 0.8rem;
    border: 3px solid ${ props => props.theme.colors.borderDefault };
    border-width: 3px;
    border-radius: 2px;
    min-width: 15vw;
    min-height: 15vw;
    max-width: 15vw;
`;

const selectSoundTileMainBorder = (props: any) => {
  if (props.statusBorder === 'success') return mixins.buttonGreen;
  if (props.statusBorder === 'error') return mixins.buttonRed;
  return css`
    transition-property: border-color;
    transition-duration: 1s;
    transition-delay: 2s;
  `;
};

const SoundTileMain = styled.div<SoundTileMainProps>`
  position: relative;

  > button {
    ${ mixins.button }
    
    font-size: 1.2rem;
    color: white;
    border: 5px solid ${ props => props.theme.colors.borderDefault };
    border-radius: 3px;
    box-shadow: 0px 2px 5px 2px ${ props => props.theme.colors.shadowDefault };
    min-width: 150px;
    min-height: 150px;
    max-width: 150px;
    margin: 6px 6px;
    background-color: ${ props => props.tagColor ? props.tagColor : props.theme.colors.innerA };
    word-wrap: break-word;
    ${ mixins.textShadowVisibility }
  
    ${ props => props.small && soundTileSmall }

    ${ props => props.preview && 'border-style: dashed;' }
    ${ props => selectSoundTileMainBorder(props) }
  
    @media only screen and (max-width: 780px) {
      border: 3px solid ${ props => props.theme.colors.borderDefault };
      border-width: 3px;
      border-radius: 2px;
      min-width: 20vw;
      min-height: 20vw;
      max-width: 20vw;

      ${ props => props.small && soundTileSmallMobile }
    }
  }

  > span {
    ${ mixins.iconButton }
    ${ mixins.textShadowVisibility }
    
    position: absolute;
    right: 12px;
    top: 12px;
    opacity: ${ props => props.theme.name === 'halloween' ? '20%' : '50%' };
    
    ${ props => props.small && css`
      font-size: 12px;
      right: 8px;
      top: 8px;
    ` }

    ${ props => props.isFavorite && css`
      color:#fcc82a;
      opacity: ${ props.theme.name === 'halloween' ? '85%' : '75%' };
    ` }

    &:hover {
      opacity: 100%;
      ${ props => props.theme.name === 'halloween' && 'filter: brightness(1.4)' }
    }

    @media only screen and (max-width: 780px) {
      font-size: 1.4rem;
      right: 11px;
      top: 11px; 
    
      ${ props => props.small && css`
        font-size: 12px;
        right: 7px;
        top: 7px;
    ` }
    }
  }
`;

interface SoundTileProps {
  id: string;
  preview: boolean;
  small: boolean;
  sound: Sound;
  tagColor: string | undefined;
  soundRequest: (soundName: string, borderCallback: () => void) => void;
  previewRequest: (soundName: string) => void;
  updateFavRequest: (soundId: string) => void;
  currentlyTagging: boolean;
  unsavedTagged: string[];
  toggleSoundOnTag: (soundId: string) => void;
}

const SoundTile: FC<SoundTileProps> = ({
  id,
  preview,
  small,
  sound: { name, isFavorite },
  tagColor,
  soundRequest,
  previewRequest,
  updateFavRequest,
  currentlyTagging,
  unsavedTagged,
  toggleSoundOnTag,
}) => {
  const [statusBorder, setStatusBorder] = useState('');
  const theme = useTheme();

  const raiseStatusSet = useCallback(() => setStatusBorder('success'), []);

  const handleSoundPlayClick = useCallback(() => {
    setStatusBorder('error');
    soundRequest(name, raiseStatusSet);
    setTimeout(() => setStatusBorder(''), 1);
  }, []);

  const handleButtonClick = useCallback(() => {
    if (currentlyTagging && preview) previewRequest(name);
    else if (currentlyTagging) toggleSoundOnTag(id);
    else if (preview) previewRequest(name);
    else handleSoundPlayClick();
  }, [currentlyTagging, unsavedTagged, preview]);

  const isFavIcon = theme.name === 'halloween' ? '💀' : 'star';
  const isNotFavIcon = theme.name === 'halloween' ? '💀' : 'star_outline';

  return (
    <SoundTileMain
      preview={ preview }
      statusBorder={ statusBorder }
      small={ small }
      isFavorite={ isFavorite }
      tagColor={ tagColor ?? null }
    >
      <button
        type="button"
        onClick={ handleButtonClick }
      >
        { name }
      </button>
      <span
        className='material-icons'
        role="presentation"
        onClick={ () => updateFavRequest(name) }
      >
        { isFavorite ? isFavIcon : isNotFavIcon }
      </span>
    </SoundTileMain>
  );
};

export default SoundTile;
