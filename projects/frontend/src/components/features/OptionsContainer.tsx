import React, { FC, useState } from 'react';
import styled, { css } from 'styled-components';
import { buttonGreen, button } from '../../styles/mixins';
import { InnerShadow, ToggleButtonBase } from '../../styles/components';
import AddSoundDialog from './AddSoundDialog';
import GroupTagsButton from './GroupTagsButton';
import { usePrefs } from '../../contexts/prefs-context';
import { useCustomTags } from '../../contexts/custom-tags-context';

const OptionsContainerMain = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${ props => props.theme.colors.innerA };
  padding: 3px 2px;
  margin-left: 14px;
  height: 94px;
  border-radius: 5px;
  position: relative;
  z-index: 20;
  box-shadow: 0px 0px 10px 2px ${ props => props.theme.colors.shadowDefault };

  button {
    box-shadow: 0px 0px 10px 0px ${ props => props.theme.colors.shadowDefault };
  }

  @media only screen and (max-width: 780px) {
    flex-direction: row;
    align-items: center;
    margin: 4px 8px;
    height: auto;
    width: 100%;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  position: relative;

  @media only screen and (min-width: 780px) {
    &:first-of-type {
      margin-bottom: 2px;
    }
  }
`;

const OptionsButton = styled(ToggleButtonBase)`
  width: 174px;
  margin: 2px;

  @media only screen and (max-width: 780px) {
    height: 60px;
    width: 50%;
    font-size: 1.4rem;
  }

  @media only screen and (max-width: 550px) {
    font-size: 1.2rem;
  }
`;

const EditTagsButton = styled(OptionsButton)`
  background: rgb(249,139,139);
  background: linear-gradient(90deg, rgba(249,139,139,1) 0%, rgba(252,250,133,1) 20%, rgba(128,254,138,1) 40%, rgba(151,160,255,1) 60%, rgba(255,177,251,1) 80%, rgba(255,142,165,1) 100%);

  ${ props => props.disabled && css`
    opacity: 0.5;
    pointer-events: none;
  ` }
`;

const AddSoundButton = styled(OptionsButton)`
  border-color: ${ props => props.theme.colors.borderGold };
  ${ props => props.toggled ? buttonGreen : button }

  @media only screen and (max-width: 780px) {
    border-color: ${ props => props.theme.colors.borderGold };
  }
`;

const OptionsContainer: FC = () => {
  const [showAddSound, setShowAddSound] = useState(false);
  const [disableAddSoundButton, setDisableAddSoundButton] = useState(false);
  const { toggleSoundSortOrder, sortRules } = usePrefs();
  const { showCustomTagPicker, disableEditTagsButton, toggleShowCustomTagPicker } = useCustomTags();

  return (
    <OptionsContainerMain>
      <ButtonRow>
        <EditTagsButton
          toggled={ showCustomTagPicker }
          onClick={ toggleShowCustomTagPicker }
          disabled={ disableEditTagsButton }
        >
          <InnerShadow />
          Edit Custom Tags
        </EditTagsButton>
        <AddSoundButton
          toggled={ disableAddSoundButton }
          disabled={ disableAddSoundButton }
          onClick={ () => setShowAddSound(!showAddSound) }
        >
          <InnerShadow />
          Add Sound
        </AddSoundButton>
      </ButtonRow>
      <ButtonRow>
        <OptionsButton toggled={ false } onClick={ toggleSoundSortOrder }>
          <InnerShadow />
          { `Sort: ${ sortRules.sortOrder }` }
        </OptionsButton>
        <GroupTagsButton />
      </ButtonRow>
      { showAddSound && <AddSoundDialog setShowAddsound={ setShowAddSound } setDisableAddSoundButton={ setDisableAddSoundButton } /> }
    </OptionsContainerMain>
  );
};

export default OptionsContainer;
