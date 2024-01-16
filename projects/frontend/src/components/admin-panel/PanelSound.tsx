import React, { FC } from 'react';
import styled from 'styled-components';
import Sound from '../../models/sound';
import { textShadowVisibility, button } from '../../styles/mixins';
import { InnerShadow } from '../../styles/components';

const PanelSoundMain = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    cursor: pointer;
    opacity: 0.7;
    margin: 2px;

    &:hover {
      opacity: 1;
    }
  }
`;

interface SoundSectionStyleProps {
  isSelected?: boolean;
}

const PanelSoundSection = styled.div<SoundSectionStyleProps>`
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  border: 3px solid ${ props => props.theme.colors.accent };
  border-radius: 3px;
  padding: 5px 15px;
  margin: 4px;
  background-color: ${ props => props.isSelected ? props.theme.colors.buttonHighlighted : props.theme.colors.innerA };
  ${ textShadowVisibility }
  
  h4 {
    margin: 0px 20px 0px 0px;
  }

  &:first-child {
    flex-grow: 1;
    ${ button }
  }

  > span {
    margin: 0;
    font-size: 1.1rem;
  }
`;

interface PanelSoundProps {
  sound: Sound;
  selectedSoundId: string | undefined;
  setSelectedSound: (sound: Sound) => void;
  soundPreview: () => Promise<void>;
}

const PanelSound: FC<PanelSoundProps> = ({ sound, selectedSoundId, setSelectedSound, soundPreview }) => (
  <PanelSoundMain>
    <PanelSoundSection onClick={ () => setSelectedSound(sound) } isSelected={ selectedSoundId === sound.id }>
      <InnerShadow />
      <h4>{ sound.name }</h4>
      { (sound.volume && sound.volume !== 1) && <span className='material-icons'>equalizer</span> }
    </PanelSoundSection>
    <span className='material-icons' role='presentation' onClick={ soundPreview }>play_circle</span>
  </PanelSoundMain>
);

export default PanelSound;
