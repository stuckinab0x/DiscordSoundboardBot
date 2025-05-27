import { FC, useCallback } from 'react';
import { StyledSlider } from '../styles/components';

interface VolumeSliderProps {
  setPreviewVolume: (volume: string) => void;
}

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
