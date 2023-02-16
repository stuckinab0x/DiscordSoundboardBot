import React, { FC, useState } from 'react';
import styled from 'styled-components';
import * as mixins from '../../styles/mixins';
import AddSoundDialog from './AddSoundDialog';
import GroupTagsButton from './GroupTagsButton';
import { useSortRules } from '../../contexts/sort-rules-context';
import { useCustomTags } from '../../contexts/custom-tags-context';

const OptionsContainerMain = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${ props => props.theme.colors.innerA };
  justify-content: space-between;
  align-items: center;
  min-width: 348px;
  margin-left: 14px;
  padding: 6px 6px;
  border-radius: 5px;
  position: relative;
  z-index: 20;
  box-shadow: 0px 1px 8px 1px ${ props => props.theme.colors.shadowDefault };

  @media only screen and (max-width: 780px) {
    margin: 4px 8px;
    padding: 2px 6px 4px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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
`;

interface ButtonProps {
  toggled: boolean;
}

const ButtonToggle = styled.button<ButtonProps>`
  ${ mixins.button }
  ${ mixins.filterButton }
  ${ mixins.filterButtonMobile }
  ${ mixins.textShadowVisibility }
  min-width: 169px;

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
  min-width: 171px;
  
  border-color: ${ props => props.theme.colors.borderGold };
  ${ props => props.toggled ? mixins.buttonGreen : mixins.button }

  @media only screen and (max-width: 780px) {
    border-color: ${ props => props.theme.colors.borderGold };
    margin-top: 2px;
    width: 174px;
  }
  
`;

const OptionsContainer: FC = () => {
  const [showAddSound, setShowAddSound] = useState(false);
  const [disableAddSoundButton, setDisableAddSoundButton] = useState(false);
  const { toggleSoundSortOrder, sortRules } = useSortRules();
  const { showCustomTagPicker, disableEditTagsButton, toggleShowCustomTagPicker } = useCustomTags();

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
          { `Sort: ${ sortRules.sortOrder }` }
        </ButtonToggle>
        <GroupTagsButton />
      </ButtonRow>
      { showAddSound && <AddSoundDialog setShowAddsound={ setShowAddSound } setDisableAddSoundButton={ setDisableAddSoundButton } /> }
    </OptionsContainerMain>
  );
};

export default OptionsContainer;
