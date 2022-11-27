import React, { FC, useState, useCallback, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import SWRProvider from '../providers/SWRProvider';
import Nav from './nav/Nav';
import Features from './features/Features';
import ButtonContainer from './ButtonContainer';
import SortContainer from './SortContainer';
import debounce from '../utils';
import * as themes from '../styles/themes';
import GlobalStyle from '../styles/global-style';
import Snowflakes from './decorative/Snowflakes';
import Fireworks from './decorative/Fireworks';

const AppMain = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
`;

function getThemeFromDate(date: string) {
  if (date.includes('July 4')) return themes.americaTheme;
  if (date.includes('Oct')) return themes.halloweenTheme;
  if (date.includes('Dec')) return themes.christmasTheme;
  return themes.defaultTheme;
}

const theme = getThemeFromDate(new Date().toString());

const App: FC = () => {
  const [sortRules, setSortRules] = useState({ favorites: false, small: false, searchTerm: '' });

  const toggleSmallButtons = useCallback(() => {
    setSortRules(oldState => ({ ...oldState, small: !oldState.small }));
  }, [sortRules.small]);

  const toggleFavs = useCallback(() => {
    setSortRules(oldState => ({ ...oldState, favorites: !oldState.favorites }));
  }, [sortRules.favorites]);

  const [showPreview, setShowPreview] = useState(false);
  const toggleShowPreview = useCallback(() => {
    setShowPreview(!showPreview);
  }, [showPreview]);

  const setSearchTerm = useCallback((searchTerm: string) => {
    setSortRules(oldState => ({ ...oldState, searchTerm }));
  }, [sortRules.searchTerm]);

  const [previewVolume, setPreviewVolume] = useState('.5');
  const [previewGain, setPreviewGain] = useState<GainNode | null>(null);
  useEffect(() => {
    if (previewGain)
      previewGain.gain.value = Number(previewVolume);
  }, [previewVolume, previewGain]);

  const soundRequest = useCallback(debounce((soundName: string, borderCallback: () => void) => {
    borderCallback();
    fetch('/api/sound', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: soundName,
    })
      .then(res => {
        if (res.status === 401) window.location.reload();
      })
      .catch();
  }, 2000, true), []);

  const previewRequest = useCallback(async (soundName: string) => {
    const soundUrl = await fetch(`/api/preview?soundName=${ soundName }`, { headers: { 'Content-Type': 'text/plain' } });
    const audioRes = await fetch(await soundUrl.text());
    const resBuffer = await audioRes.arrayBuffer();
    const context = new AudioContext();
    const gain = context.createGain();

    setPreviewGain(gain);

    await context.decodeAudioData(resBuffer, buffer => {
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(gain).connect(context.destination);
      source.start(0);
    });
  }, [previewVolume]);

  return (
    <AppMain>
      <SWRProvider>
        <ThemeProvider theme={ theme }>
          <GlobalStyle />
          { theme.name === 'america' && <Fireworks /> }
          { (theme.name === 'christmas' || theme.name === 'halloween') && <Snowflakes /> }
          <Nav />
          <Features
            favoritesToggled={ sortRules.favorites }
            previewToggled={ showPreview }
            toggleFavs={ toggleFavs }
            toggleShowPreview={ toggleShowPreview }
            setSearchTerm={ setSearchTerm }
          />
          <SortContainer
            showPreview={ showPreview }
            toggleSmallButtons={ toggleSmallButtons }
            setPreviewVolume={ setPreviewVolume }
          />
          <ButtonContainer
            preview={ showPreview }
            soundRequest={ soundRequest }
            previewRequest={ previewRequest }
            sortRules={ { favorites: sortRules.favorites, small: sortRules.small, searchTerm: sortRules.searchTerm } }
          />
        </ThemeProvider>
      </SWRProvider>
    </AppMain>
  );
};

export default App;
