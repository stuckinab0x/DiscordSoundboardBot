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
  position: relative;
  
  > div:first-of-type {
    display: flex;
    justify-content: space-between;
    position: relative;
    padding: 0px 24px;
    box-shadow: 0px 5px 5px 2px ${ props => props.theme.colors.shadowDefault };

    z-index: 150;
  }
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
  z-index: 50;
  min-width: 0;

  @media only screen and (max-width: 780px) {
    flex-direction: column;
  }   
`;

interface TitleProps {
  secret: boolean;
}

const Title = styled.div<TitleProps>`
  display: flex;
  overflow: hidden;
  
  > h1 {
    ${ props => props.theme.name === 'America' && 'color: white;' }
    font-size: 2rem;
    text-shadow: 0px 3px 3px ${ props => props.theme.colors.shadowDefault };
    position: relative;
    user-select: none;
    white-space: nowrap;

    ${ props => props.theme.name === 'Christmas' && 'filter: brightness(1.7) saturate(1.3);' }

    ${ props => props.secret && css`
      cursor: pointer;

      &:hover {
        text-shadow: 0px 0px 10px yellow;
      }
  ` }

    @media only screen and (max-width: 780px) {
      margin: 10px 0px 4px;
    }
  }
`;

const Username = styled.div`
  display: flex;
  align-items: center;

  > h2 {
    font-size: 1.5rem;
    color: white;
    text-shadow: 0px 3px 3px ${ props => props.theme.colors.shadowDefault };
    position: relative;
    margin: 0px 12px;
  }

  @media only screen and (max-width: 780px) {
    margin: 4px 0px 12px;

    > h2 {
      margin-left: 2px;
    }
  }
`;

interface AdminButtonStyleProps {
  toggled: boolean;
}

const AdminButton = styled.button<AdminButtonStyleProps>`
  ${ button }
  ${ filterButton }
  position: relative;
  min-width: max-content;

  ${ props => props.toggled && `background-color: ${ props.theme.colors.buttonHighlighted };` }
  border-width: 2px;
  font-size: 0.7rem;

  @media only screen and (max-width: 780px) {
    min-height: 20px;
    font-size: 0.8rem;
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
      <div>
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
      </div>
      { themeName === 'America' && <UsaNavImg src='usanav.png' /> }
      { themeName === 'Christmas' ? (
        <LeavesContainer>
          { [0, 1].map(x => <ChristmasLeaves key={ x } />) }
        </LeavesContainer>
      ) : null }
      { themeName === 'Christmas' && <ChristmasLights /> }
    </NavMain>
  );
};

export default Nav;
