import React, { FC, useCallback, useState } from 'react';
import styled, { css, useTheme } from 'styled-components';
import * as mixins from '../styles/mixins';
import Sound from '../models/sound';
import { useCustomTags } from '../contexts/custom-tags-context';
import { InnerShadow } from '../styles/components';

const soundTileSmall = css`
  font-size: 0.6rem;
  border: 2px solid ${ props => props.theme.colors.accent };
  border-radius: 2px;
  width: 75px;
  height: 75px;
  margin: 4px 4px;
`;

const soundTileSmallMobile = css`
    font-size: 1rem;
    border: 3px solid ${ props => props.theme.colors.accent };
    border-width: 3px;
    border-radius: 2px;
    width: 15vw;
    height: 15vw;
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
  overflow: hidden;

  > button {
    ${ mixins.button }
    position: relative;
    
    font-size: 1.2rem;
    color: white;
    border: 5px solid ${ props => props.theme.colors.accent };
    border-radius: 3px;
    ${ props => props.taggingModeOn && 'border-style: dotted;' }
    box-shadow: 0px 2px 5px 2px ${ props => props.theme.colors.shadowDefault };
    height: 150px;
    width: 150px;
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
      width: 20vw;
      height: 20vw;

      ${ props => props.small && soundTileSmallMobile }
    }
  }
`;

interface ButtonBaseProps {
  small: boolean;
  toggled?: boolean;
}

const ButtonBase = styled.span<ButtonBaseProps>`
  ${ mixins.iconButton }
  ${ mixins.textShadowVisibility }
  opacity: 0.6;
    
  position: absolute;
    
  ${ props => props.small && css`
    font-size: 15px;
  ` }

  ${ props => props.toggled && css`
    color:#fcc82a;
    opacity: 1;
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
  right: 14px;
  top: 14px;
  ${ props => props.theme.name === 'Halloween' && 'opacity: 0.4;' }

  ${ props => props.small && css`
    right: 8px;
    top: 8px;
  ` }
`;

const MySoundButton = styled(ButtonBase)`
  right: 14px;
  bottom: 14px;

  ${ props => props.small && css`
    right: 8px;
    bottom: 8px;
  ` }
`;

interface PreviewButtonStyleProps {
  small: boolean;
}

const PreviewButton = styled(ButtonBase)<PreviewButtonStyleProps>`
  display: flex;
  align-items: center;
  bottom: 14px;
  left: 14px;
  text-shadow: 0px 0px 6px ${ props => props.theme.colors.shadowDefault };
  ${ mixins.iconButton }

  ${ props => props.small && css`
    left: 8px;
    bottom: 8px;
  ` }

  &::after {
    content: 'Preview';
    display: none;
    padding-left: 2px;
    font-size: ${ props => props.small ? '0.6rem' : '0.8rem' };
    font-family: ${ props => props.theme.font };
    font-weight: bold;
  }

  &:hover::after {
    display: inline;
  }
  
  @media only screen and (max-width: 780px) {
    font-size: ${ props => props.small ? '1rem' : '1.3rem' };
  }

  @media only screen and (min-width: 780px) {
    &:hover {
      opacity: 1;
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
        { name }
        <InnerShadow />
      </button>
      <FavStarButton className='material-icons' small={ small } toggled={ isFavorite } onClick={ updateFavRequest }>
        { isFavorite ? isFavIcon : isNotFavIcon }
      </FavStarButton>
      <PreviewButton small={ small } className='material-icons' onClick={ soundPreview }>
        play_circle
      </PreviewButton>
      <MySoundButton className='material-icons' small={ small } onClick={ updateMySound } toggled={ isIntroSound }>
        face
      </MySoundButton>
    </SoundTileMain>
  );
};

export default SoundTile;
