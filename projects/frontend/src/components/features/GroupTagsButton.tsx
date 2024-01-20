import { FC, useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { InnerShadow, ToggleButtonBase } from '../../styles/components';
import useInitialSortRules from '../../hooks/use-initial-sort-rules';
import { usePrefs } from '../../contexts/prefs-context';
import { GroupOrder } from '../../models/sort-rules';

const ButtonMain = styled(ToggleButtonBase)`
  width: 174px;
  margin: 2px;
  ${ props => props.theme.name === '20XD6' && 'font-size: 11pt;' }

  @media only screen and (max-width: 780px) {
    height: 60px;
    width: 50%;
    font-size: 1.4rem;
  }
`;

const GroupTagsButton: FC = () => {
  const [mode, setMode] = useState(useInitialSortRules().groupOrder);
  const [text, setText] = useState('Off');
  const { toggleSoundGrouping } = usePrefs();

  useEffect(() => {
    let newText = 'Off';
    if (mode === 'start') newText = 'Start';
    else if (mode === 'end') newText = 'End';
    setText(newText);
  }, [mode]);

  const handleClick = useCallback(() => {
    let newMode: GroupOrder = 'none';
    if (mode === 'none') newMode = 'start';
    else if (mode === 'start') newMode = 'end';
    setMode(newMode);
  }, [mode]);

  return (
    <ButtonMain toggled={ mode !== 'none' } onClick={ () => { handleClick(); toggleSoundGrouping(); } }>
      <InnerShadow />
      { `Group Tags: ${ text }` }
    </ButtonMain>
  );
};

export default GroupTagsButton;
