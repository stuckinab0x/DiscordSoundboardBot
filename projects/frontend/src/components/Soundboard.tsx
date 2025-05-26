import { FC } from 'react';
import styled from 'styled-components';
import { TransitionStatus } from 'react-transition-group';
import useSoundPreview from '../hooks/use-sound-preview';
import { useCustomTags } from '../contexts/custom-tags-context';
import Features from './features/Features';
import SoundBoardToolbar from './toolbar/Toolbar';
import TagPicker from './custom-tags/TagPicker';
import ButtonContainer from './ButtonContainer';
import { usePrefs } from '../contexts/prefs-context';
import ThemeSelector from './toolbar/ThemeSelector';

interface SoundboardStyleProps {
  $state: TransitionStatus;
}

const SoundboardMain = styled.div<SoundboardStyleProps>`
  overflow-y: scroll;
  flex: 1;

  transition: opacity 0.4s ease-out;
  opacity: ${ props => props.$state === 'entered' || props.$state === 'entering' ? '1' : '0' };

  &::-webkit-scrollbar {
    width: 15px;
    height: 100%;
  }

  &::-webkit-scrollbar-track {
    background: ${ props => props.theme.colors.innerB }
  }

  &::-webkit-scrollbar-thumb {
    background: ${ props => props.theme.colors.nav };
  }
`;

interface SoundboardProps {
  state: TransitionStatus;
}

const Soundboard: FC<SoundboardProps> = ({ state }) => {
  const { showCustomTagPicker } = useCustomTags();
  const { soundPreview, setPreviewVolume } = useSoundPreview();
  const { showThemePicker, setShowThemePicker } = usePrefs();

  return (
    <SoundboardMain $state={ state }>
      <Features />
      { showCustomTagPicker && (
      <TagPicker />
      ) }
      <SoundBoardToolbar
        setPreviewVolume={ setPreviewVolume }
      />
      { showThemePicker ? <ThemeSelector close={ () => setShowThemePicker(false) } /> : (
        <ButtonContainer
          soundPreview={ soundPreview }
        />
      ) }
    </SoundboardMain>
  );
};

export default Soundboard;
