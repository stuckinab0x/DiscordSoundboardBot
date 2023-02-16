import React, { FC, useCallback, useState } from 'react';
import styled from 'styled-components';
import { useSortRules } from '../../contexts/sort-rules-context';
import { button, filterButton, filterButtonMobile, textShadowVisibility } from '../../styles/mixins';

interface ButtonMainProps {
  color: string;
  toggled: boolean;
}

const ButtonMain = styled.button<ButtonMainProps>`
  ${ button }
  ${ filterButton }
  ${ filterButtonMobile }
  ${ textShadowVisibility }

  background-color: ${ props => props.color };
  ${ props => props.toggled ? `border-color: ${ props.theme.colors.borderGreen }` : null };

  @media only screen and (max-width: 780px) {
    margin: 2px;
  }
`;

interface TagFilterButtonProps {
  id: string;
  name: string;
  color: string;
}

const TagFilterButton: FC<TagFilterButtonProps> = ({ id, name, color }) => {
  const [toggled, setToggled] = useState(false);
  const { toggleTagFilter } = useSortRules();

  const handleClick = useCallback(() => {
    setToggled(!toggled);
  }, [toggled]);

  return (
    <ButtonMain color={ color } toggled={ toggled } onClick={ () => { toggleTagFilter(id); handleClick(); } }>
      { name }
    </ButtonMain>
  );
};

export default TagFilterButton;
