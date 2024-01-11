import React, { FC, useCallback, useMemo, useState } from 'react';
import styled, { css, useTheme } from 'styled-components';
import useSWR from 'swr';
import useUser from '../../hooks/use-user';
import AvatarContainer from './AvatarContainer';
import ChristmasLights from '../decorative/ChristmasLights';
import ChristmasLeaves from '../decorative/ChristmasLeaves';
import { button, filterButton } from '../../styles/mixins';
import { pickRandom } from '../../utils';
import useSoundPreview from '../../hooks/use-sound-preview';
import Sound from '../../models/sound';

const NavMain = styled.div`
  background-color: ${ props => props.theme.colors.nav };
  box-shadow: 0px 5px 5px 2px ${ props => props.theme.colors.shadowDefault };
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 100%;

  z-index: 150;
`;

const LeavesContainer = styled.div`
  width: 100vw;
  height: 100px;
  position: absolute;
  overflow: hidden;
`;

const UsaNavImg = styled.img`
  position: absolute;
  left: 670px;
  bottom: 0;
  height: 90px;
  width: auto;
`;

const TitleAndUsername = styled.div`
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  margin-left: 20px;
  z-index: 50;

  @media only screen and (max-width: 780px) {
    flex-direction: column;
  }   
`;

interface TitleProps {
  secret: boolean;
}

const Title = styled.div<TitleProps>`
  > h1 {
    ${ props => props.theme.name === 'America' && 'color: white;' }
    font-size: 2rem;
    text-shadow: 0px 3px 3px ${ props => props.theme.colors.shadowDefault };
    position: relative;
    user-select: none;

    ${ props => props.theme.name === 'Christmas' && 'filter: brightness(1.7) saturate(1.3);' }
  }
  
  @media only screen and (max-width: 780px) {
    max-height: 20px;
  }

  ${ props => props.secret && css`
    cursor: pointer;

    h1:hover {
      text-shadow: 0px 0px 10px yellow;
    }
  ` }
`;

const Username = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 10px;

  @media only screen and (max-width: 780px) {
    margin-top: 14px;
    width: 100%
  }

  > h2 {
    font-size: 1.5rem;
    color: white;
    text-shadow: 0px 3px 3px ${ props => props.theme.colors.shadowDefault };
    position: relative;
  }
`;

interface AdminButtonStyleProps {
  toggled: boolean;
}

const AdminButton = styled.button<AdminButtonStyleProps>`
  ${ button }
  ${ filterButton }

  ${ props => props.toggled && `background-color: ${ props.theme.colors.buttonHighlighted };` }
  border-width: 2px;
  margin: 5px 20px 0px 0px;
  font-size: 0.7rem;

  @media only screen and (max-width: 780px) {
    min-height: 20px;
    font-size: 0.8rem;
    margin-left: 10px;
    order: 1;
  }
`;

function getTitleFromTheme(themeName: string, name: string) {
  if (themeName === 'America') return 'DiscordSoundboardBot, FUCK YEAH';
  if (themeName === 'Halloween') return 'DiscordSpookboardBot';
  if (themeName === 'Christmas') return 'DiscordSoundboardClaus';

  const titles = [
    'DiscordSoundboardBot',
    'Soul Full of Pizza 🎷🎶 🍕',
    'Baba is Soundboard',
    'FUCKING SOUNDBOARD 98',
    'IIIII DID IT!',
    `${ name } sucks lol`,
    'sofullofpizza.dk',
    'SoundboardXD_2024 was the imposter!',
    'Somewhat Full of Pizza~🥂',
    'Sponsored by pickRandom()TM',
    'he said the thing',
    'HEY guys WHAT IS UP and today I\'m going to be showing you how to play sounds',
    'I wouldn\'t',
  ];

  return pickRandom(titles);
}

interface NavProps {
  showAdminPanel: boolean;
  setShowAdminPanel: (show: boolean) => void;
}

const Nav: FC<NavProps> = ({ showAdminPanel, setShowAdminPanel }) => {
  const user = useUser();
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const { name: themeName } = useTheme();

  const title = useMemo(() => getTitleFromTheme(themeName, user.name), []);

  const { data: soundsData } = useSWR<{ introSound: string | undefined, sounds: Sound[] }>('/api/sounds');
  const { soundPreview } = useSoundPreview();

  const playSecretSound = useCallback(() => {
    if (title === 'he said the thing') {
      const sound = soundsData?.sounds.find(x => x.name.toLowerCase().includes('liam pizza'));
      if (sound)
        soundPreview(sound.url);
    }
  }, [title, soundsData]);

  return (
    <NavMain>
      { themeName === 'America' && <UsaNavImg src='usanav.png' /> }
      { themeName === 'Christmas' ? (
        <LeavesContainer>
          { [0, 1].map(x => <ChristmasLeaves key={ x } />) }
        </LeavesContainer>
      ) : null }
      { themeName === 'Christmas' && <ChristmasLights /> }
      <TitleAndUsername>
        <Title secret={ title === 'he said the thing' }>
          <h1 role='presentation' onClick={ playSecretSound }>{ title }</h1>
        </Title>
        <Username>
          { user.role === 'admin' && <AdminButton toggled={ showAdminPanel } onClick={ () => setShowAdminPanel(!showAdminPanel) }>Admin Panel</AdminButton> }
          <h2>
            { user.name }
          </h2>
        </Username>
      </TitleAndUsername>
      <AvatarContainer showLogoutMenu={ showLogoutMenu } setShowLogoutMenu={ setShowLogoutMenu } />
    </NavMain>
  );
};

export default Nav;
