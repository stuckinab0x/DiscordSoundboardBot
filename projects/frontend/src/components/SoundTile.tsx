import { FC, useCallback, useState } from 'react';
import styled, { css, useTheme } from 'styled-components';
import * as mixins from '../styles/mixins';
import Sound from '../models/sound';
import { useCustomTags } from '../contexts/custom-tags-context';
import { SortOrder } from '../models/sort-rules';

const soundTileSmall = css`
  font-size: 0.6rem;
  border-radius: 2px;
  width: 100px;
  height: 100px;
  margin: 4px 4px;
`;

const soundTileSmallMobile = css`
    font-size: 1rem;
    border-width: 3px;
    border-radius: 2px;
    width: 15vw;
    height: 15vw;
    min-width: 100px;
    min-height: 100px;
`;

type Status = 'pending' | 'success' | 'error' | 'idle';

const getPlaybackResultStyle = (status: Status) => {
  if (status === 'success') return css`
    background-color: ${ props => props.theme.colors.borderGreen };

    > p {
      opacity: 0;
    }
  `;
  if (status === 'pending') return css`
    background-color: yellow;
  `;
  if (status === 'error') return css`
    background-color: ${ props => props.theme.colors.borderRed };
  `;
  return css`
    transition-property: background-color;
    transition-duration: 1s;
    transition-delay: 1.5s;
    
    > p {
      transition: opacity 2s cubic-bezier(1,.01,.54,.75);
    }
  `;
};

interface SoundTileMainProps {
  $status: Status;
  $small: boolean;
  $tagColor: string | null;
  $taggingModeOn: boolean;
  $disableBorder: boolean;
}

const SoundTileMain = styled.div<SoundTileMainProps>`
  position: relative;
  overflow: hidden;

  > button {
    ${ mixins.button }
    position: relative;
    
    font-size: 1.2rem;
    color: white;
    border: none;
    border-radius: 2px;
    ${ props => props.$taggingModeOn && 'border-style: dotted;' }
    box-shadow: 0px 0 2px 0 ${ props => props.theme.colors.shadowDefault };
    height: 150px;
    width: 150px;
    margin: 6px 6px;
    background-color: ${ props => props.$tagColor ? props.$tagColor : props.theme.colors.innerA };
    word-wrap: break-word;
    
    ${ mixins.textShadowVisibility }
  
    ${ props => props.$small && soundTileSmall }

    > p {
      opacity: 1;
    }

    ${ props => props.$disableBorder ? null : getPlaybackResultStyle(props.$status) }

    @media only screen and (max-width: 780px) {
      width: 20vw;
      height: 20vw;
      min-height: 100px;
      min-width: 100px;

      ${ props => props.$small && soundTileSmallMobile }
    }
  }
`;

interface ButtonBaseProps {
  $small: boolean;
  $toggled?: boolean;
}

const ButtonBase = styled.span<ButtonBaseProps>`
  ${ mixins.textShadowVisibility }
  cursor: pointer;
  opacity: 0.6;
    
  position: absolute;
    
  ${ props => props.$small && css`
    font-size: 15px;
  ` }

  ${ props => props.$toggled && css`
    color:#fcc82a;
    opacity: 1;
  ` }

  &:hover {
    opacity: 100%;
  }

  @media only screen and (max-width: 780px) {
    font-size: 1.4rem;
    
    ${ props => props.$small && css`
      font-size: 12px;
    ` }
  }
`;

const FavStarButton = styled(ButtonBase)`
  right: 14px;
  top: 14px;
  ${ props => props.theme.name === 'Halloween' && 'opacity: 0.4;' }

  ${ props => props.$small && css`
    right: 8px;
    top: 8px;
  ` }
`;

const MySoundButton = styled(ButtonBase)`
  right: 14px;
  bottom: 14px;

  ${ props => props.$small && css`
    right: 8px;
    bottom: 8px;
  ` }
`;

interface CounterStyleProps {
  $status: Status;
  $alwaysShow: boolean;
  $in: boolean;
}

const Counter = styled.div<CounterStyleProps>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: -5px;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: ${ props => props.$alwaysShow ? 0.3 : 0 };
  text-shadow: none;

  ${ props => props.$in && 'transition: opacity 2s, text-shadow 2s;' }
  ${ props => props.$status === 'success' && 'opacity: 1; text-shadow: 0px 0px 6px black; transition: none;' }

  > p {
    color: white;
    font-size: 5rem;
    font-weight: 400;
  }
`;

interface PreviewButtonStyleProps {
  $small: boolean;
}

const PreviewButton = styled(ButtonBase)<PreviewButtonStyleProps>`
  display: flex;
  align-items: center;
  bottom: 14px;
  left: 14px;
  text-shadow: 0px 0px 6px ${ props => props.theme.colors.shadowDefault };

  ${ props => props.$small && css`
    left: 8px;
    bottom: 8px;
  ` }

  &::after {
    content: 'Preview';
    display: none;
    padding-left: 2px;
    font-size: ${ props => props.$small ? '0.6rem' : '0.8rem' };
    font-family: ${ props => props.theme.font };
    font-weight: bold;
  }

  &:hover::after {
    display: inline;
  }
  
  @media only screen and (max-width: 780px) {
    font-size: ${ props => props.$small ? '1rem' : '1.3rem' };
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
  sortOrder: SortOrder;
  cooldown: boolean;
  soundRequest: (soundId: string) => Promise<number>;
  refreshCooldown: () => void;
  soundPreview: () => Promise<void>;
  updateFavRequest: () => void;
  updateMySound: () => void;
  currentlyTagging: boolean;
  unsavedTagged: string[];
  disableBorder: boolean;
}

const SoundTile: FC<SoundTileProps> = ({
  small,
  sound: { id, name, isFavorite, playCount },
  isIntroSound,
  tagColor,
  sortOrder,
  cooldown,
  soundRequest,
  refreshCooldown,
  soundPreview,
  updateFavRequest,
  updateMySound,
  currentlyTagging,
  unsavedTagged,
  disableBorder,
}) => {
  const [status, setStatus] = useState<Status>('idle');
  const [counter, setCounter] = useState(playCount);
  const [counterIn, setCounterIn] = useState(false);
  const { name: themeName } = useTheme();
  const { toggleSoundOnTag } = useCustomTags();

  const handleSoundPlayClick = useCallback(async () => {
    refreshCooldown();
    setCounterIn(false);
    setStatus('pending');
    if (!cooldown) {
      const result = await soundRequest(id);
      setStatus(result === 204 ? 'success' : 'error');
      if (result === 204) {
        setCounter(oldState => oldState + 1);
        setCounterIn(true);
        setTimeout(() => setCounterIn(false), 2000);
      }
    }
    setTimeout(() => setStatus('idle'), 500);
  }, [cooldown, refreshCooldown, soundRequest]);

  const handleButtonClick = useCallback(() => {
    if (currentlyTagging) return toggleSoundOnTag(id);
    return handleSoundPlayClick();
  }, [currentlyTagging, unsavedTagged, handleSoundPlayClick]);

  const isFavIcon = themeName === 'Halloween' ? '💀' : 'star';
  const isNotFavIcon = themeName === 'Halloween' ? '💀' : 'star_outline';

  return (
    <SoundTileMain
      $status={ status }
      $small={ small }
      $tagColor={ tagColor ?? null }
      $taggingModeOn={ currentlyTagging }
      $disableBorder={ disableBorder }
    >
      <button
        type="button"
        onClick={ handleButtonClick }
      >
        <p>{ name }</p>
      </button>
      <FavStarButton className='material-icons' $small={ small } $toggled={ isFavorite } onClick={ updateFavRequest }>
        { isFavorite ? isFavIcon : isNotFavIcon }
      </FavStarButton>
      <PreviewButton $small={ small } className='material-icons' onClick={ soundPreview }>
        play_circle
      </PreviewButton>
      <MySoundButton className='material-icons' $small={ small } onClick={ updateMySound } $toggled={ isIntroSound }>
        face
      </MySoundButton>
      <Counter $status={ status } $alwaysShow={ sortOrder === 'Popularity' } $in={ counterIn }><p>{ counter }</p></Counter>
    </SoundTileMain>
  );
};

export default SoundTile;
