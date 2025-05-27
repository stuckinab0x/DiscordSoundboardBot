import { FC } from 'react';
import styled from 'styled-components';
import VolumeSlider from '../VolumeSlider';

const PreviewVolumeMain = styled.div`
  color: white;
  display: flex;
  align-items: center;
  justify-content: left;
  flex-grow: 1;

  > span, input {
    margin: 2px 10px 0 0;
  }

  > p {
    margin: 0;
    opacity: 0.8;
    font-weight: bold;
    text-shadow: 2px 2px 3px ${ props => props.theme.colors.shadowDefault };

    ${ props => props.theme.name === 'Christmas' && 'filter: brightness(1.4) saturate(1.4);' }
    ${ props => props.theme.name === 'Boomer' && 'color: white;' }
  }

  @media only screen and (max-width: ${ props => props.theme.params.widthSelector3 }px) {
    > span {
      display: none;
    }

    > span, input {
      margin: 0;
    }
  }
`;

interface PreviewVolumeProps {
  setPreviewVolume: (volume: string) => void;
}

const PreviewVolume: FC<PreviewVolumeProps> = ({ setPreviewVolume }) => (
  <PreviewVolumeMain>
    <span className='material-icons'>play_circle_outline</span>
    <p>Preview Volume</p>
    <VolumeSlider setPreviewVolume={ setPreviewVolume } />
  </PreviewVolumeMain>
);

export default PreviewVolume;
