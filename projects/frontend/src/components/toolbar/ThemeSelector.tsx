import React, { FC, useCallback } from 'react';
import styled from 'styled-components';
import { usePrefs } from '../../contexts/prefs-context';
import useUser from '../../hooks/use-user';
import themes from '../../styles/themes';
import ThemeButton from './ThemeButton';
import { CloseBar, InnerShadow } from '../../styles/components';

const SelectorMain = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  display: flex;
  flex-direction: column;
  background-color: ${ props => props.theme.colors.innerA };
  border: 5px solid ${ props => props.theme.colors.accent };
  border-radius: 5px;
  padding: 5px;
  box-shadow: 0px 0px 10px 0px ${ props => props.theme.colors.shadowDefault };
  z-index: 100;

  > :first-child {
    display: flex;
  }

  ${ CloseBar } {
    margin: 6px;
  }

  @media only screen and (max-width: 780px) {
    position: fixed;
    left: 20px;
    right: 20px;
    top: 100px;

    > :first-child {
      flex-direction: column;
    }
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

  @media only screen and (max-width: 780px) {
    > h4 {
      font-size: 1.4rem;
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
          { themes.slice(4).map(x => <ThemeButton key={ x.name } name={ x.name } handleClick={ handleThemeClick } />) }
        </Column>
        { role === 'admin' && (
        <Column>
          <h2>(Admin)</h2>
          <Divider />
          { themes.slice(1, 4).map(x => <ThemeButton key={ x.name } name={ x.name } handleClick={ handleThemeClick } />) }
        </Column>
        )}
      </div>
      <CloseBar onClick={ close }>
        <p>Close</p>
      </CloseBar>
      <InnerShadow />
    </SelectorMain>
  );
};

export default ThemeSelector;
