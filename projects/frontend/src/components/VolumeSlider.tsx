import React, { FC, useCallback } from 'react';
import styled, { css } from 'styled-components';

interface VolumeSliderProps {
  setPreviewVolume: (volume: string) => void;
}

const sliderThumb = css`
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: ${ props => props.theme.colors.volumeSliderThumb };
  cursor: ew-resize;
  box-shadow: 0 0 2px 0 #555;
`;

const StyledSlider = styled.input`
  &[type="range"] {
    -webkit-appearance: none;
    margin-left: 15px;
    height: 7px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 5px;
    background-image: linear-gradient( ${ props => props.theme.colors.volumeSliderFill }, ${ props => props.theme.colors.volumeSliderFill } );
    background-size: 50%;
    background-repeat: no-repeat;
  }
  
  &[type="range"]::-webkit-slider-thumb {
    ${ sliderThumb }
  }
  
  &[type=range]::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    box-shadow: none;
    border: none;
    background: transparent;
  }

  &[type="range"]::-moz-range-thumb {
    ${ sliderThumb }
  }

  @media only screen and (max-width: 780px) {
    &[type="range"] {
      height: 5px;
    }
  
    &[type="range"]::-webkit-slider-thumb {
      height: 18px;
      width: 18px;
    }
  
    &[type=range]::-webkit-slider-runnable-track {

    }

    &[type="range"]::-moz-range-thumb {

    }
  }
`;

const VolumeSlider: FC<VolumeSliderProps> = ({ setPreviewVolume }) => {
  const animateVolumeInput = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    const min = Number(event.currentTarget.min);
    const max = Number(event.currentTarget.max);
    event.currentTarget.style.backgroundSize = `${ ((Number(event.currentTarget.value) - min) * 100) / (max - min) }% 100%`;
  }, []);

  return (
    <StyledSlider
      type="range"
      min={ 0 }
      max={ 2 }
      defaultValue="1"
      step="0.01"
      onInput={ event => {
        setPreviewVolume(event.currentTarget.value);
        animateVolumeInput(event);
      } }
    />
  );
};

export default VolumeSlider;
