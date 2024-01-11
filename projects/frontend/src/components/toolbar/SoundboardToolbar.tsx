import React, { FC, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { iconButton, textShadowVisibility } from '../../styles/mixins';
import PreviewVolume from './PreviewVolume';
import TaggingInstructions from './TaggingInstructions';
import { usePrefs } from '../../contexts/prefs-context';
import { useCustomTags } from '../../contexts/custom-tags-context';
import ThemeSelector from './ThemeSelector';
import { InnerShadow } from '../../styles/components';
import { getSeasonalThemeName } from '../../utils';

const ToolbarMain = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 20px 4vw 0px;
  position: relative;
`;

interface ThemeButtonProps {
  glow: boolean;
}

const ThemeButton = styled.div<ThemeButtonProps>`
  display: flex;
  align-items: center;
  background-color: ${ props => props.theme.colors.innerA };
  border: 2px solid ${ props => props.theme.colors.accent };
  border-radius: 4px;
  margin-right: 20px;
  padding: 4px 8px;
  box-shadow: 0px 0px 10px 0px ${ props => props.theme.colors.shadowDefault };
  cursor: pointer;
  user-select: none;
  position: relative;

  &:hover:not(:active) {
    filter: brightness(1.1);
  }

  > span {
    color: ${ props => props.theme.colors.accent };
    font-size: 1.8rem;
    margin-right: 4px;
  }

  > h4 {
    color: white;
    margin: 0;
  }

  > span, h4 {
    ${ textShadowVisibility }
  }

  ${ props => props.glow && css`
    animation: neon3 1.5s ease-in-out infinite alternate;

    @keyframes neon3 {
      from {
        box-shadow: 0 0 4px 3px #ffd000;
      }
      to {
        box-shadow: 0 0 30px 5px #ffd000;
      }
    }
  ` }
`;

const ResizeIcon = styled.div`
  ${ iconButton }

  @media only screen and (max-width: 780px) {
    width: 100%;
    display: flex;
    margin-right: 10px;
    justify-content: right;
  }
`;

const ResizeSpan = styled.span`
  color: ${ props => props.theme.colors.accent };

  font-size: 2.5rem;
  margin-right: -10px;
  user-select: none;
  text-shadow: 0px 2px 5px ${ props => props.theme.colors.shadowDefault };

  ${ props => props.theme.name === 'Christmas' && 'filter: brightness(1.2);' }

  &:first-child {
    font-size: 1.5rem;
  }

  @media only screen and (max-width: 780px) {
    margin-right: -4px;
  }
`;

interface SoundboardToolbarProps {
  setPreviewVolume: (volume: string) => void;
}

const SoundboardToolbar: FC<SoundboardToolbarProps> = ({ setPreviewVolume }) => {
  const { toggleSmallButtons } = usePrefs();
  const { currentlyTagging } = useCustomTags();
  const { themePrefs: { theme }, showThemePicker, setShowThemePicker } = usePrefs();

  const isHoliday = useMemo(() => getSeasonalThemeName() !== 'Classic', []);

  return (
    <ToolbarMain>
      <ThemeButton onClick={ () => setShowThemePicker(!showThemePicker) } glow={ isHoliday }>
        <InnerShadow />
        <span className="material-symbols-outlined">palette</span>
        <h4>{ theme }</h4>
      </ThemeButton>
      <PreviewVolume setPreviewVolume={ setPreviewVolume } />
      { currentlyTagging && (
      <TaggingInstructions
        tagName={ currentlyTagging.name }
        tagColor={ currentlyTagging.color }
      />
      ) }
      <div>
        <ResizeIcon role="presentation" onClick={ toggleSmallButtons }>
          { [0, 1].map(x => <ResizeSpan key={ x } className='material-icons'>crop_square</ResizeSpan>) }
        </ResizeIcon>
      </div>
      { showThemePicker && <ThemeSelector close={ () => setShowThemePicker(false) } /> }
    </ToolbarMain>
  );
};

export default SoundboardToolbar;
