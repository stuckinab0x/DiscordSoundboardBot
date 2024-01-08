import React, { FC, useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { ToggleButtonBase } from '../../styles/mixins';
import usePrefs from '../../hooks/use-prefs';
import { useSortRules } from '../../contexts/sort-rules-context';
import { GroupOrder } from '../../models/sort-rules';

const ButtonMain = styled(ToggleButtonBase)`
  width: 174px;
  margin: 2px;

  @media only screen and (max-width: 780px) {
    height: 60px;
    width: 50%;
    font-size: 1.4rem;
  }
`;

const GroupTagsButton: FC = () => {
  const [mode, setMode] = useState(usePrefs().groupOrder);
  const [text, setText] = useState('Off');
  const { toggleSoundGrouping } = useSortRules();

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
      { `Group Tags: ${ text }` }
    </ButtonMain>
  );
};

export default GroupTagsButton;
