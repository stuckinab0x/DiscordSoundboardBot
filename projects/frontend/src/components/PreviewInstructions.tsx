import React, { FC, useCallback } from 'react';
import styled, { css } from 'styled-components';

const sliderThumb = css`
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: ${ props => props.theme.colors.volumeSliderThumb };
  cursor: ew-resize;
  box-shadow: 0 0 2px 0 #555;
`;

const PreviewInstructionsMain = styled.div`
  color: ${ props => props.theme.colors.borderDefault };
  display: flex;
  align-items: center;
  justify-content: left;
  flex-grow: 2;

  > p {
    ${ props => props.theme.name === 'america' && `color: ${ props.theme.colors.buttonHover };` }
    margin: 0;
    margin-left: 8px;
    font-weight: bold;
    text-shadow: 2px 2px 3px ${ props => props.theme.colors.shadowDefault };

    ${ props => props.theme.name === 'christmas' && 'filter: brightness(1.4) saturate(1.4);' }
  }

  > input[type="range"] {
    -webkit-appearance: none;
    margin-left: 15px;
    height: 7px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 5px;
    background-image: linear-gradient( ${ props => props.theme.colors.volumeSliderFill }, ${ props => props.theme.colors.volumeSliderFill } );
    background-size: 25%;
    background-repeat: no-repeat;
  }
  
  > input[type="range"]::-webkit-slider-thumb {
    ${ sliderThumb }
  }
  
  > input[type=range]::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    box-shadow: none;
    border: none;
    background: transparent;
  }

  > input[type="range"]::-moz-range-thumb {
    ${ sliderThumb }
  }
`;

interface PreviewInstructionsProps {
  setPreviewVolume: (volume: string) => void;
  taggingModeOn: boolean;
}

const PreviewInstructions: FC<PreviewInstructionsProps> = ({ setPreviewVolume, taggingModeOn }) => {
  const animateVolumeInput = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    const min = Number(event.currentTarget.min);
    const max = Number(event.currentTarget.max);
    event.currentTarget.style.backgroundSize = `${ ((Number(event.currentTarget.value) - min) * 100) / (max - min) }% 100%`;
  }, []);

  return (
    <PreviewInstructionsMain>
      <p>{ taggingModeOn ? 'PREVIEW ACTIVE, disable to resume tagging' : 'Sounds will only play through your browser' }</p>
      <input
        type="range"
        min={ 0 }
        max={ 2 }
        defaultValue=".5"
        step="0.01"
        onInput={ event => {
          setPreviewVolume(event.currentTarget.value);
          animateVolumeInput(event);
        } }
      />
    </PreviewInstructionsMain>
  );
};

export default PreviewInstructions;
