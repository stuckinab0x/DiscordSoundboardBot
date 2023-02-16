import React, { FC, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import Nav from './nav/Nav';
import AdminPanel from './admin-panel/AdminPanel';
import Soundboard from './Soundboard';
import * as themes from '../styles/themes';
import GlobalStyle from '../styles/global-style';
import Snowflakes from './decorative/Snowflakes';
import Fireworks from './decorative/Fireworks';
import SortRulesProvider from '../contexts/sort-rules-context';
import CustomTagsProvider from '../contexts/custom-tags-context';

const AppMain = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  overflow-y: hidden;
`;

function getThemeFromDate() {
  const date = new Date().toString();
  if (date.includes('July 4')) return themes.americaTheme;
  if (date.includes('Oct')) return themes.halloweenTheme;
  if (date.includes('Dec')) return themes.christmasTheme;
  return themes.defaultTheme;
}

const theme = getThemeFromDate();

const App: FC = () => {
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  return (
    <AppMain>
      <ThemeProvider theme={ theme }>
        <GlobalStyle />
        { theme.name === 'america' && <Fireworks /> }
        { (theme.name === 'christmas' || theme.name === 'halloween') && <Snowflakes /> }
        <Nav showAdminPanel={ showAdminPanel } setShowAdminPanel={ setShowAdminPanel } />
        <AdminPanel show={ showAdminPanel } adminPanelClosed={ () => setShowAdminPanel(false) } />
        <SortRulesProvider>
          <CustomTagsProvider>
            <CSSTransition in={ !showAdminPanel } timeout={ 410 }>
              { state => (<Soundboard state={ state } />) }
            </CSSTransition>
          </CustomTagsProvider>
        </SortRulesProvider>
      </ThemeProvider>
    </AppMain>
  );
};

export default App;
