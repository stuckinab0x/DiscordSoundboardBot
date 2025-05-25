import { FC, useCallback, useState } from 'react';
import { usePrefs } from '../../contexts/prefs-context';
import { FilterButton } from '../../styles/components';

interface TagFilterButtonProps {
  id: string;
  name: string;
  color: string;
}

const TagFilterButton: FC<TagFilterButtonProps> = ({ id, name, color }) => {
  const [toggled, setToggled] = useState(false);
  const { toggleTagFilter } = usePrefs();

  const handleClick = useCallback(() => {
    setToggled(!toggled);
  }, [toggled]);

  return (
    <FilterButton $color={ color } $toggled={ toggled } onClick={ () => { toggleTagFilter(id); handleClick(); } }>
      { name }
    </FilterButton>
  );
};

export default TagFilterButton;
