import React, { FC, useCallback, useState } from 'react';
import styled, { css, useTheme } from 'styled-components';
import * as mixins from '../styles/mixins';
import Sound from '../models/sound';
import { useCustomTags } from '../contexts/custom-tags-context';

const soundTileSmall = css`
  font-size: 0.6rem;
  border: 2px solid ${ props => props.theme.colors.accent };
  border-radius: 2px;
  min-width: 75px;
  min-height: 75px;
  max-width: 75px;
  margin: 4px 4px;
`;

const soundTileSmallMobile = css`
    font-size: 1rem;
    border: 3px solid ${ props => props.theme.colors.accent };
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
  disableBorder: boolean;
}

const SoundTileMain = styled.div<SoundTileMainProps>`
  position: relative;

  > button {
    ${ mixins.button }
    position: relative;
    
    font-size: 1.2rem;
    color: white;
    border: 5px solid ${ props => props.theme.colors.accent };
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

    ${ props => props.disableBorder ? null : selectSoundTileMainBorder(props.statusBorder) }
  
    @media only screen and (max-width: 780px) {
      border: 3px solid ${ props => props.theme.colors.accent };
      border-width: 3px;
      border-radius: 2px;
      min-width: 20vw;
      min-height: 20vw;
      max-width: 20vw;

      ${ props => props.small && soundTileSmallMobile }
    }
  }
`;

const InnerShadow = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  box-shadow: inset 0px 0px 4px 0px ${ props => props.theme.colors.shadowSoundInner };
`;

interface ButtonBaseProps {
  small: boolean;
  active: boolean;
}

const ButtonBase = styled.span<ButtonBaseProps>`
  ${ mixins.iconButton }
  ${ mixins.textShadowVisibility }
    
  position: absolute;
    
  ${ props => props.small && css`
    font-size: 15px;
  ` }

  &:hover {
    opacity: 100%;
  }

  @media only screen and (max-width: 780px) {
    font-size: 1.4rem;
    
    ${ props => props.small && css`
      font-size: 12px;
    ` }
  }
`;

const FavStarButton = styled(ButtonBase)`
  right: 12px;
  top: 12px;
  opacity: ${ props => props.theme.name === 'Halloween' ? '20%' : '50%' };
    
  ${ props => props.small && css`
    right: 8px;
    top: 8px;
  ` }

  ${ props => props.active && css`
    color:#fcc82a;
    opacity: ${ props.theme.name === 'Halloween' ? '85%' : '75%' };
  ` }

  &:hover {
    ${ props => props.theme.name === 'Halloween' && 'filter: brightness(1.4)' }
  }

  @media only screen and (max-width: 780px) {
    right: 11px;
    top: 11px; 
    
    ${ props => props.small && css`
      right: 10px;
      top: 10px;
    ` }
  }
`;

const MySoundButton = styled(ButtonBase)`
  right: 14px;
  bottom: 14px;
  opacity: 50%;

  ${ props => props.small && css`
    right: 8px;
    bottom: 8px;
  ` }

  ${ props => props.active && css`
    color:#fcc82a;
    opacity: 100%;
  ` }

  @media only screen and (max-width: 780px) {
    right: 11px;
    bottom: 11px; 
    
    ${ props => props.small && css`
      right: 10px;
      bottom: 10px;
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
  isIntroSound: boolean;
  tagColor: string | undefined;
  soundRequest: (soundId: string, borderCallback: () => void) => void;
  soundPreview: () => Promise<void>;
  updateFavRequest: () => void;
  updateMySound: () => void;
  currentlyTagging: boolean;
  unsavedTagged: string[];
  disableBorder: boolean;
}

const SoundTile: FC<SoundTileProps> = ({
  small,
  sound: { id, name, isFavorite },
  isIntroSound,
  tagColor,
  soundRequest,
  soundPreview,
  updateFavRequest,
  updateMySound,
  currentlyTagging,
  unsavedTagged,
  disableBorder,
}) => {
  const [statusBorder, setStatusBorder] = useState('');
  const { name: themeName } = useTheme();
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

  const isFavIcon = themeName === 'Halloween' ? '💀' : 'star';
  const isNotFavIcon = themeName === 'Halloween' ? '💀' : 'star_outline';

  return (
    <SoundTileMain
      statusBorder={ statusBorder }
      small={ small }
      tagColor={ tagColor ?? null }
      taggingModeOn={ currentlyTagging }
      disableBorder={ disableBorder }
    >
      <button
        type="button"
        onClick={ handleButtonClick }
      >
        <InnerShadow />
        { name }
      </button>
      <FavStarButton
        className='material-icons'
        role="presentation"
        small={ small }
        active={ isFavorite }
        onClick={ updateFavRequest }
      >
        { isFavorite ? isFavIcon : isNotFavIcon }
      </FavStarButton>
      <PreviewButton small={ small }>
        <span role='presentation' className='material-icons' onClick={ soundPreview }>play_circle</span>
        <p>Preview</p>
      </PreviewButton>
      <MySoundButton className='material-icons' small={ small } onClick={ updateMySound } active={ isIntroSound }>
        face
      </MySoundButton>
    </SoundTileMain>
  );
};

export default SoundTile;
