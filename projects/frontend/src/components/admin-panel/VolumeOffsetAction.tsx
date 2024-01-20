import { FC, useRef, useState, useEffect, useCallback, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useSWRConfig } from 'swr';
import useSoundPreview from '../../hooks/use-sound-preview';
import Sound from '../../models/sound';
import themes from '../../styles/themes';

const ActionContainer = styled.div`
  h4 {
    width: 35px;
    margin: 0px 10px;
    cursor: pointer;
  }
  span {
    &:nth-of-type(2) {
      color: ${ props => props.theme.colors.borderGreen };
      margin-right: 6px;
    }
    &:nth-of-type(3) {
      color: ${ props => props.theme.colors.borderRed }
    }
  }
`;

const sliderThumb = css`
  appearance: none;
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
    appearance: none;
    -webkit-appearance: none;
    margin-left: 15px;
    height: 7px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 5px;
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

interface VolumeOffsetActionProps {
  sound: Sound;
  setNotification: (text: string, color: string) => void;
}

const VolumeOffsetAction: FC<VolumeOffsetActionProps> = ({ sound: { id, name, url, volume }, setNotification }) => {
  const { setPreviewVolume, soundPreview } = useSoundPreview();
  const { mutate } = useSWRConfig();
  const soundVolume = useMemo(() => (String(volume || '')), [volume]);
  const [rangeValue, setRangeValue] = useState(String(volume) || '1');
  const [enableSave, setEnableSave] = useState(false);
  const sliderRef = useRef(null);

  const resetAction = useCallback(() => {
    setRangeValue(soundVolume || '1');
    setEnableSave(false);
  }, [id, soundVolume]);

  useEffect(() => resetAction(), [id]);

  const setRangeToOne = useCallback(() => setRangeValue('1'), []);

  useEffect(() => {
    setPreviewVolume(rangeValue);
    setEnableSave((Boolean(volume) && rangeValue !== soundVolume) || (!volume && rangeValue !== '1'));
  }, [rangeValue, volume]);

  const saveVolumeRequest = useCallback(async () => {
    const res = await fetch(
      `/api/sounds/${ id }`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volume: Number(rangeValue) }),
      },
    );
    if (res.status !== 204)
      return setNotification('YIKES, something broke', themes[0].colors.borderRed);
    setEnableSave(false);
    await mutate('/api/sounds');
    return setNotification(`Updated volume of "${ name }" to ${ rangeValue }`, '');
  }, [rangeValue]);

  return (
    <ActionContainer>
      <h3>Offset</h3>
      <span className='material-icons' role='presentation' onClick={ () => soundPreview(url) }>play_circle</span>
      <StyledSlider
        ref={ sliderRef }
        type='range'
        min={ 0 }
        max={ 3 }
        value={ rangeValue }
        step='0.01'
        onInput={ event => setRangeValue(event.currentTarget.value) }
      />
      <h4 role='presentation' onClick={ setRangeToOne }>{ rangeValue }</h4>
      { enableSave && (
      <>
        <span className='material-icons' role='presentation' onClick={ saveVolumeRequest }>check</span>
        <span className='material-icons' role='presentation' onClick={ resetAction }>cancel</span>
      </>
      )}
    </ActionContainer>
  );
};

export default VolumeOffsetAction;
