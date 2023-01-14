import React, { FC, useState } from 'react';
import styled from 'styled-components';
import * as mixins from '../../styles/mixins';
import AddSoundDialog from './AddSoundDialog';
import GroupTagsButton from './GroupTagsButton';

const OptionsContainerMain = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${ props => props.theme.colors.innerA };
  justify-content: space-between;
  align-items: center;
  width: max-content;
  margin-top: 16px;
  margin-left: 14px;
  padding: 6px 6px;
  border-radius: 5px;
  position: relative;
  z-index: 20;

  @media only screen and (max-width: 780px) {
    margin: 4px 8px;
    padding: 2px 6px 4px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;

  > p {
    margin: 0px 5px;
  }

  &:nth-child(2) {
    margin-top: 6px;

    @media only screen and (max-width: 780px) {
      margin-top: 2px;
    }
  }

  @media only screen and (max-width: 780px) {
    justify-content: space-between;
  }
`;

interface ButtonProps {
  toggled: boolean;
}

const ButtonToggle = styled.button<ButtonProps>`
  ${ mixins.button }
  ${ mixins.filterButton }
  ${ mixins.filterButtonMobile }
  ${ mixins.textShadowVisibility }

  @media only screen and (max-width: 780px) {
    margin-top: 2px;
  }

  ${ props => props.toggled && `background-color: ${ props.theme.colors.buttonHighlighted };` }
`;

const EditTagsButton = styled(ButtonToggle)`
  ${ mixins.textShadowVisibility }
  
  background: rgb(249,139,139);
  background: linear-gradient(90deg, rgba(249,139,139,1) 0%, rgba(252,250,133,1) 20%, rgba(128,254,138,1) 40%, rgba(151,160,255,1) 60%, rgba(255,177,251,1) 80%, rgba(255,142,165,1) 100%);
`;

const DisableEditButton = styled.button`
  ${ mixins.filterButton }
  background: linear-gradient(90deg, rgba(249,139,139,1) 0%, rgba(252,250,133,1) 20%, rgba(128,254,138,1) 40%, rgba(151,160,255,1) 60%, rgba(255,177,251,1) 80%, rgba(255,142,165,1) 100%);
  opacity: 0.6;
`;

const AddSoundButton = styled.button<ButtonProps>`
  ${ mixins.filterButton }
  ${ mixins.filterButtonMobile }
  
  border-color: ${ props => props.theme.colors.borderGold };

  ${ props => props.toggled ? mixins.buttonGreen : mixins.button }

  @media only screen and (max-width: 780px) {
    margin-top: 2px;
  }
`;

interface OptionsContainerProps {
  disableEditTagsButton: boolean;
  showCustomTagPicker: boolean;
  toggleShowCustomTagPicker: () => void;
  previewToggled: boolean;
  toggleShowPreview: () => void;
  toggleSoundGrouping: () => void;
  soundSortOrder: string;
  toggleSoundSortOrder: () => void;
}

const OptionsContainer: FC<OptionsContainerProps> = ({
  disableEditTagsButton,
  showCustomTagPicker,
  toggleShowCustomTagPicker,
  previewToggled,
  toggleShowPreview,
  toggleSoundGrouping,
  soundSortOrder,
  toggleSoundSortOrder,
}) => {
  const [showAddSound, setShowAddSound] = useState(false);
  const [disableAddSoundButton, setDisableAddSoundButton] = useState(false);

  return (
    <OptionsContainerMain>
      <ButtonRow>
        { disableEditTagsButton ? <DisableEditButton>Edit Custom Tags</DisableEditButton> : (
          <EditTagsButton
            toggled={ showCustomTagPicker }
            onClick={ toggleShowCustomTagPicker }
          >
            Edit Custom Tags
          </EditTagsButton>
        ) }
        <ButtonToggle
          toggled={ previewToggled }
          onClick={ toggleShowPreview }
        >
          Preview Sounds
        </ButtonToggle>
        <AddSoundButton
          toggled={ disableAddSoundButton }
          disabled={ disableAddSoundButton }
          onClick={ () => setShowAddSound(!showAddSound) }
        >
          Add Sound
        </AddSoundButton>
      </ButtonRow>
      <ButtonRow>
        <ButtonToggle toggled={ false } onClick={ toggleSoundSortOrder }>
          { `Sort: ${ soundSortOrder }` }
        </ButtonToggle>
        <GroupTagsButton toggleSoundGrouping={ toggleSoundGrouping } />
      </ButtonRow>
      { showAddSound && <AddSoundDialog setShowAddsound={ setShowAddSound } setDisableAddSoundButton={ setDisableAddSoundButton } /> }
    </OptionsContainerMain>
  );
};

export default OptionsContainer;
