import React, { FC, useMemo, useState } from 'react';
import styled, { DefaultTheme, ThemeProvider } from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import Nav from './nav/Nav';
import AdminPanel from './admin-panel/AdminPanel';
import Soundboard from './Soundboard';
import GlobalStyle from '../styles/global-style';
import Snowflakes from './decorative/Snowflakes';
import Fireworks from './decorative/Fireworks';
import CustomTagsProvider from '../contexts/custom-tags-context';
import { usePrefs } from '../contexts/prefs-context';
import themes from '../styles/themes';
import { getSeasonalThemeName } from '../utils';

const AppMain = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  overflow-y: hidden;
`;

const App: FC = () => {
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const { themePrefs: { theme, useSeasonal } } = usePrefs();

  const resolvedTheme = useMemo<DefaultTheme>(() => {
    if (!useSeasonal && theme === 'Classic')
      return themes[0];
    if (theme === 'Classic')
      return themes.find(x => x.name === getSeasonalThemeName()) || themes[0];

    return themes.find(x => x.name === theme) || themes[0];
  }, [theme, useSeasonal]);

  return (
    <AppMain>
      <ThemeProvider theme={ resolvedTheme }>
        <GlobalStyle />
        { theme === 'America' && <Fireworks /> }
        { (theme === 'Christmas' || theme === 'Halloween') && <Snowflakes /> }
        <Nav showAdminPanel={ showAdminPanel } setShowAdminPanel={ setShowAdminPanel } />
        <AdminPanel show={ showAdminPanel } adminPanelClosed={ () => setShowAdminPanel(false) } />
        <CustomTagsProvider>
          <CSSTransition in={ !showAdminPanel } timeout={ 410 }>
            { state => (<Soundboard state={ state } />) }
          </CSSTransition>
        </CustomTagsProvider>
      </ThemeProvider>
    </AppMain>
  );
};

export default App;
