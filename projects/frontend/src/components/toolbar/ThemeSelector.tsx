import { FC, useCallback } from 'react';
import styled from 'styled-components';
import { usePrefs } from '../../contexts/prefs-context';
import useUser from '../../hooks/use-user';
import themes from '../../styles/themes';
import ThemeButton from './ThemeButton';
import { CloseBar } from '../../styles/components';
import { textShadowVisibility } from '../../styles/mixins';

const SelectorMain = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${ props => props.theme.colors.innerA };
  border-radius: 2px;
  padding: 5px;
  box-shadow: 0px 0px 2px ${ props => props.theme.colors.shadowDefault };
  z-index: 200;

  > :last-child {
    display: flex;
  }

  > ${ CloseBar } {
    margin: 6px;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 180px;
  margin: 0px 5px;

  > h2 {
    color: white;
    margin: 0;
    ${ textShadowVisibility }
  }

  @media only screen and (max-width: ${ props => props.theme.params.widthSelector3 }px) {
    min-width: 100px;
  }
`;

const Divider = styled.div`
  background-color: ${ props => props.theme.colors.accent };
  height: 2px;
  margin-bottom: 2px;
  width: 100%;
`;

const SeasonalOption = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin: 2px 0px;
  
  > h4 {
    color: white;
    margin: 0px 6px;
  }

  > div {
    border: 2px solid ${ props => props.theme.colors.accent };
    border-radius: 2px;
    height: 24px;
    width: 24px;
    cursor: pointer;
    user-select: none;
    margin: 0px 6px;

    > span {
      color: ${ props => props.theme.colors.accent };
    }
  }
`;

interface ThemeSelectorProps {
  close: () => void;
}

const ThemeSelector: FC<ThemeSelectorProps> = ({ close }) => {
  const { themePrefs, setThemePrefs, saveTheme } = usePrefs();

  const { role } = useUser();

  const handleCheckClick = useCallback(() => {
    setThemePrefs(oldState => ({ ...oldState, useSeasonal: !themePrefs.useSeasonal }));
    saveTheme(themePrefs.theme, !themePrefs.useSeasonal);
  }, [themePrefs]);

  const handleThemeClick = useCallback((themeName: string) => {
    setThemePrefs(oldState => ({ ...oldState, theme: themeName }));
    saveTheme(themeName, themePrefs.useSeasonal);
  }, [themePrefs.useSeasonal]);

  return (
    <SelectorMain>
      <CloseBar onClick={ close }>
        <p>Close Theme Selector</p>
      </CloseBar>
      <div>
        <Column>
          <h2>Theme Select</h2>
          <Divider />
          <ThemeButton name={ themes[0].name } handleClick={ handleThemeClick } />
          <SeasonalOption>
            <h4>Use seasonal</h4>
            <div role='presentation' onClick={ handleCheckClick }>
              { themePrefs.useSeasonal && <span className='material-icons'>check</span> }
            </div>
          </SeasonalOption>
          { themes.filter(x => !x.seasonal && x.name !== 'Classic').map(x => <ThemeButton key={ x.name } name={ x.name } handleClick={ handleThemeClick } />) }
        </Column>
        { role === 'admin' && (
        <Column>
          <h2>(Admin)</h2>
          <Divider />
          { themes.filter(x => x.seasonal).map(x => <ThemeButton key={ x.name } name={ x.name } handleClick={ handleThemeClick } />) }
        </Column>
        )}
      </div>
    </SelectorMain>
  );
};

export default ThemeSelector;
