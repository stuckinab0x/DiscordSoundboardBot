import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import Sound from '../../models/sound';
import { textShadowVisibility, adminPanelDivider } from '../../styles/mixins';
import AdminSoundActions from './AdminSoundActions';
import VolumeSlider from '../VolumeSlider';

const InfoContainer = styled.div`
  padding: 20px;
  ${ textShadowVisibility }

  > div {
    display: flex;
    align-items: center;
    min-height: 40px;
  
    > h2, h3 {
      margin: 0px 7px 0px 0px;
    }

    h2 {
      &:first-child {
      color: ${ props => props.theme.colors.accent }
      }
    }

    > span {
      font-size: 1.5rem;
      
      cursor: pointer;
      opacity: 0.7;

      &:hover {
      opacity: 1;
      }
    }

    @media only screen and (max-width: 780px) {
      min-height: 30px;
    }
  }

  @media only screen and (max-width: 780px) {
    box-shadow: 0px 4px 10px 0px ${ props => props.theme.colors.shadowDefault } inset;
  }
`;

const Divider = styled.hr`
  ${ adminPanelDivider }
`;

interface PanelInfoContainerProps {
  selectedSound: Sound | null;
  setSelectedSound: (sound: Sound | null) => void;
  setPreviewVolume: (volume: string) => void;
  setNotification: (text: string, color: string) => void;
}

const PanelInfoContainer:FC<PanelInfoContainerProps> = ({ selectedSound, setSelectedSound, setPreviewVolume, setNotification }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showRenameInput, setShowRenameInput] = useState(false);

  useEffect(() => {
    setShowConfirmDelete(false);
    setShowRenameInput(false);
  }, [selectedSound]);

  return (
    <InfoContainer>
      <div>
        <h2>List Volume</h2>
        <VolumeSlider setPreviewVolume={ setPreviewVolume } />
      </div>
      <Divider />
      <div>
        <h2>Name:</h2>
        <h2>{ selectedSound?.name }</h2>
      </div>
      <div>
        <h2>Id:</h2>
        <h2>{ selectedSound?.id }</h2>
      </div>
      <div>
        <h2>Created:</h2>
        <h2>{ selectedSound?.date }</h2>
      </div>
      <Divider />
      { selectedSound && selectedSound.id !== 'nope'
      && (
      <AdminSoundActions
        selectedSound={ selectedSound }
        setSelectedSound={ setSelectedSound }
        showConfirmDelete={ showConfirmDelete }
        setShowConfirmDelete={ setShowConfirmDelete }
        showRenameInput={ showRenameInput }
        setShowRenameInput={ setShowRenameInput }
        setNotification={ setNotification }
      />
      )}
    </InfoContainer>
  );
};

export default PanelInfoContainer;
