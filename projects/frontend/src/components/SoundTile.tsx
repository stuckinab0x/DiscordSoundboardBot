import React, { FC, useCallback, useState } from 'react';
import styled, { css, useTheme } from 'styled-components';
import * as mixins from '../styles/mixins';
import Sound from '../models/sound';
import { useCustomTags } from '../contexts/custom-tags-context';

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

const selectSoundTileMainBorder = (statusBorder: string) => {
  if (statusBorder === 'success') return mixins.buttonGreen;
  if (statusBorder === 'error') return mixins.buttonRed;
  return css`
    transition-property: border-color;
    transition-duration: 1s;
    transition-delay: 2s;
  `;
};

interface SoundTileMainProps {
  statusBorder: string;
  small: boolean;
  tagColor: string | null;
  taggingModeOn: boolean;
}

const SoundTileMain = styled.div<SoundTileMainProps>`
  position: relative;

  > button {
    ${ mixins.button }
    
    font-size: 1.2rem;
    color: white;
    border: 5px solid ${ props => props.theme.colors.borderDefault };
    border-radius: 3px;
    ${ props => props.taggingModeOn && 'border-style: dotted;' }
    box-shadow: 0px 2px 5px 2px ${ props => props.theme.colors.shadowDefault };
    min-width: 150px;
    min-height: 150px;
    max-width: 150px;
    margin: 6px 6px;
    background-color: ${ props => props.tagColor ? props.tagColor : props.theme.colors.innerA };
    word-wrap: break-word;
    ${ mixins.textShadowVisibility }
  
    ${ props => props.small && soundTileSmall }

    ${ props => selectSoundTileMainBorder(props.statusBorder) }
  
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
`;

interface FavStarStyleProps {
  small: boolean;
  isFavorite: boolean;
}

const FavStarButton = styled.span<FavStarStyleProps>`
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
`;

interface PreviewButtonStyleProps {
  small: boolean;
}

const PreviewButton = styled.div<PreviewButtonStyleProps>`
  display: flex;
  align-items: center;
  position: absolute;
  opacity: 0.6;
  width: 30px;
  height: 30px;
  bottom: ${ props => props.small ? '0px' : '12px' };
  left: ${ props => props.small ? '8px' : '15px' };
  text-shadow: 0px 0px 6px ${ props => props.theme.colors.shadowDefault };

  > span {
    ${ mixins.iconButton }
    margin-right: 4px;
    ${ props => props.small && 'font-size: 0.8rem;' }

    @media only screen and (max-width: 780px) {
      font-size: ${ props => props.small ? '1rem' : '1.3rem' };
    }
  }

  > p {
    display: none;
    margin: 0;
    font-size: ${ props => props.small ? '0.6rem' : '0.8rem' };
    font-weight: bold;
    pointer-events: none;
  }

  @media only screen and (max-width: 780px) {
    bottom: ${ props => props.small ? '0px' : '4px' };
    left: ${ props => props.small ? '10px' : '12px' };
  }

  @media only screen and (min-width: 780px) {
    &:hover {
      opacity: 1;

      > p {
        display: block;
      }
    }
  }
`;

interface SoundTileProps {
  small: boolean;
  sound: Sound;
  tagColor: string | undefined;
  soundRequest: (soundId: string, borderCallback: () => void) => void;
  soundPreview: () => Promise<void>;
  updateFavRequest: (soundId: string) => void;
  currentlyTagging: boolean;
  unsavedTagged: string[];
}

const SoundTile: FC<SoundTileProps> = ({
  small,
  sound: { id, name, isFavorite },
  tagColor,
  soundRequest,
  soundPreview,
  updateFavRequest,
  currentlyTagging,
  unsavedTagged,
}) => {
  const [statusBorder, setStatusBorder] = useState('');
  const theme = useTheme();
  const { toggleSoundOnTag } = useCustomTags();

  const raiseStatusSet = useCallback(() => setStatusBorder('success'), []);

  const handleSoundPlayClick = useCallback(() => {
    setStatusBorder('error');
    soundRequest(id, raiseStatusSet);
    setTimeout(() => setStatusBorder(''), 1);
  }, []);

  const handleButtonClick = useCallback(() => {
    if (currentlyTagging) return toggleSoundOnTag(id);
    return handleSoundPlayClick();
  }, [currentlyTagging, unsavedTagged]);

  const isFavIcon = theme.name === 'halloween' ? '💀' : 'star';
  const isNotFavIcon = theme.name === 'halloween' ? '💀' : 'star_outline';

  return (
    <SoundTileMain
      statusBorder={ statusBorder }
      small={ small }
      tagColor={ tagColor ?? null }
      taggingModeOn={ currentlyTagging }
    >
      <button
        type="button"
        onClick={ handleButtonClick }
      >
        { name }
      </button>
      <FavStarButton
        className='material-icons'
        role="presentation"
        small={ small }
        isFavorite={ isFavorite }
        onClick={ () => updateFavRequest(name) }
      >
        { isFavorite ? isFavIcon : isNotFavIcon }
      </FavStarButton>
      <PreviewButton small={ small }>
        <span role='presentation' className='material-icons' onClick={ soundPreview }>play_circle</span>
        <p>Preview</p>
      </PreviewButton>
    </SoundTileMain>
  );
};

export default SoundTile;
