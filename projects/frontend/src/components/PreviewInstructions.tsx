import React, { FC } from 'react';
import styled from 'styled-components';
import VolumeSlider from './VolumeSlider';

const PreviewInstructionsMain = styled.div`
  color: ${ props => props.theme.colors.borderDefault };
  display: flex;
  align-items: center;
  justify-content: left;
  flex-grow: 1;

  > span {
    margin-right: 10px;
  }

  > p {
    ${ props => props.theme.name === 'america' && `color: ${ props.theme.colors.buttonHover };` }
    margin: 0;
    opacity: 0.8;
    font-weight: bold;
    text-shadow: 2px 2px 3px ${ props => props.theme.colors.shadowDefault };

    ${ props => props.theme.name === 'christmas' && 'filter: brightness(1.4) saturate(1.4);' }
  }

  @media only screen and (max-width: 780px) {
    margin-left: 10px;
  }
`;

interface PreviewInstructionsProps {
  setPreviewVolume: (volume: string) => void;
}

const PreviewInstructions: FC<PreviewInstructionsProps> = ({ setPreviewVolume }) => (
  <PreviewInstructionsMain>
    <span className='material-icons'>play_circle_outline</span>
    <p>Preview Volume</p>
    <VolumeSlider setPreviewVolume={ setPreviewVolume } />
  </PreviewInstructionsMain>
);

export default PreviewInstructions;
