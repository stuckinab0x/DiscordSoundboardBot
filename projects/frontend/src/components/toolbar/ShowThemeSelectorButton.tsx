import { FC } from 'react';
import styled from 'styled-components';
import { textShadowVisibility } from '../../styles/mixins';
import { usePrefs } from '../../contexts/prefs-context';
import { getSeasonalThemeName } from '../../utils';

const ShowSelectorButton = styled.div`
  display: flex;
  align-items: center;
  background-color: ${ props => props.theme.colors.innerA };
  border-radius: 2px;
  padding: 0 8px;
  cursor: pointer;
  user-select: none;
  position: relative;
  min-height: 42px;
  box-shadow: 0px 0 2px 0 ${ props => props.theme.colors.shadowDefault };

  &:hover:not(:active) {
    filter: brightness(1.1);
  }

  > span {
    color: ${ props => props.theme.colors.accent };
    font-size: 1.8rem;
    margin-right: 4px;
  }

  > h4 {
    color: white;
    margin: 0;
  }

  > span, h4 {
    ${ textShadowVisibility }
  }

  @media only screen and (max-width: ${ props => props.theme.params.widthSelector3 }px) {
    > span {
      margin: 0;
    }

    > h4 {
      display: none;
    }
  }
`;

const seasonalName = getSeasonalThemeName();

const ShowThemeSelectorButton: FC = () => {
  const { themePrefs: { theme, useSeasonal }, showThemePicker, setShowThemePicker } = usePrefs();

  return (
    <ShowSelectorButton onClick={ () => setShowThemePicker(!showThemePicker) }>
      <span className="material-symbols-outlined">palette</span>
      <h4>{ theme === 'Classic' && useSeasonal ? seasonalName : theme }</h4>
    </ShowSelectorButton>
  );
};

export default ShowThemeSelectorButton;
