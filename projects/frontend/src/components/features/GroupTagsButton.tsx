import { FC, useCallback, useState, useEffect } from 'react';
import { OptionsButton } from '../../styles/components';
import useInitialSortRules from '../../hooks/use-initial-sort-rules';
import { usePrefs } from '../../contexts/prefs-context';
import { GroupOrder } from '../../models/sort-rules';

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
    <OptionsButton $toggled={ mode !== 'none' } onClick={ () => { handleClick(); toggleSoundGrouping(); } }>
      { `Group Tags: ${ text }` }
    </OptionsButton>
  );
};

export default GroupTagsButton;
