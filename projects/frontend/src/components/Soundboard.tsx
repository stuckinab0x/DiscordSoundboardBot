import { FC } from 'react';
import styled from 'styled-components';
import { TransitionStatus } from 'react-transition-group';
import useSoundPreview from '../hooks/use-sound-preview';
import { useCustomTags } from '../contexts/custom-tags-context';
import Features from './features/Features';
import SoundBoardToolbar from './toolbar/Toolbar';
import TagPicker from './custom-tags/TagPicker';
import ButtonContainer from './ButtonContainer';

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
    background: ${ props => props.theme.colors.innerA };
  }
`;

interface SoundboardProps {
  state: TransitionStatus;
}

const Soundboard: FC<SoundboardProps> = ({ state }) => {
  const { showCustomTagPicker } = useCustomTags();
  const { soundPreview, setPreviewVolume } = useSoundPreview();

  return (
    <SoundboardMain $state={ state }>
      <Features />
      <SoundBoardToolbar
        setPreviewVolume={ setPreviewVolume }
      />
      { showCustomTagPicker && (
      <TagPicker />
      ) }
      <ButtonContainer
        soundPreview={ soundPreview }
      />
    </SoundboardMain>
  );
};

export default Soundboard;
