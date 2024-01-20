import { FC, useCallback, useState } from 'react';
import styled from 'styled-components';
import { usePrefs } from '../../contexts/prefs-context';
import { button, filterButton, filterButtonMobile, textShadowVisibility } from '../../styles/mixins';
import { InnerShadow } from '../../styles/components';

interface ButtonMainProps {
  color: string;
  toggled: boolean;
}

const ButtonMain = styled.button<ButtonMainProps>`
  ${ button }
  ${ filterButton }
  ${ filterButtonMobile }
  ${ textShadowVisibility }

  box-shadow: 0px 0px 10px 0px ${ props => props.theme.colors.shadowDefault };

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
  const { toggleTagFilter } = usePrefs();

  const handleClick = useCallback(() => {
    setToggled(!toggled);
  }, [toggled]);

  return (
    <ButtonMain color={ color } toggled={ toggled } onClick={ () => { toggleTagFilter(id); handleClick(); } }>
      <InnerShadow />
      { name }
    </ButtonMain>
  );
};

export default TagFilterButton;
