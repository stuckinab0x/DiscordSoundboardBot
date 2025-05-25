import { FC, useState } from 'react';
import styled, { css } from 'styled-components';
import { OptionsButton } from '../../styles/components';
import AddSoundDialog from './AddSoundDialog';
import GroupTagsButton from './GroupTagsButton';
import { usePrefs } from '../../contexts/prefs-context';
import { useCustomTags } from '../../contexts/custom-tags-context';

const OptionsContainerMain = styled.div`
  position: relative;
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
  background-color: ${ props => props.theme.colors.borderGold };
  ${ props => props.$toggled && `background-color: ${ props.theme.colors.borderGreen };` }

  @media only screen and (max-width: 780px) {
    border-color: ${ props => props.theme.colors.borderGold };
  }
`;

const OptionsContainer: FC = () => {
  const [showAddSound, setShowAddSound] = useState(false);
  const [disableAddSoundButton, setDisableAddSoundButton] = useState(false);
  const { toggleSoundSortOrder, sortRules } = usePrefs();
  const { showCustomTagPicker, editingTag, toggleShowCustomTagPicker } = useCustomTags();

  return (
    <OptionsContainerMain>
      <EditTagsButton
        $toggled={ showCustomTagPicker }
        onClick={ toggleShowCustomTagPicker }
        disabled={ editingTag }
      >
        Edit Custom Tags
      </EditTagsButton>
      <AddSoundButton
        $toggled={ disableAddSoundButton }
        disabled={ disableAddSoundButton }
        onClick={ () => setShowAddSound(!showAddSound) }
      >
        Add Sound
      </AddSoundButton>
      <OptionsButton $toggled={ false } onClick={ toggleSoundSortOrder }>
        { `Sort: ${ sortRules.sortOrder }` }
      </OptionsButton>
      <GroupTagsButton />
      { showAddSound && <AddSoundDialog close={ () => setShowAddSound(false) } setDisableAddSoundButton={ setDisableAddSoundButton } /> }
    </OptionsContainerMain>
  );
};

export default OptionsContainer;
