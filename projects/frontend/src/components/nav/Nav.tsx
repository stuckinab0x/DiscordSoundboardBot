import { FC, useCallback, useMemo, useState } from 'react';
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
  z-index: 150;
  
  > div:first-of-type {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    min-height: 60px;
    padding: 0px 14px;

    z-index: 150;
  }

  ${ props => props.theme.name === 'Boomer' && css`
    border: 4px solid ${ props.theme.colors.accent };
    > div:first-of-type {
      --a: ${ props.theme.colors.nav };
      --b: #00d4ff;
      background: var(--a);
      background: linear-gradient(90deg, var(--a) 0%, var(--b) 100%);
      box-shadow: none;
    }
  ` }
`;

const LeavesContainer = styled.div`
  width: 100vw;
  height: 100px;
  position: absolute;
  overflow: hidden;
`;

const UsaNavImg = styled.img`
  position: absolute;
  left: 500px;
  bottom: 0;
  height: 60px;
  width: auto;
`;

const TitleAndUsername = styled.div`
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  z-index: 50;
  min-width: 0; 
`;

interface TitleProps {
  $secret: boolean;
}

const Title = styled.div<TitleProps>`
  display: flex;
  overflow: hidden;
  
  > h1 {
    font-size: 1.5rem;
    text-shadow: 0px 3px 3px ${ props => props.theme.colors.shadowDefault };
    position: relative;
    user-select: none;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin: 0;
    color: ${ props => props.theme.colors.accent }

    ${ props => (props.theme.name === 'America' || props.theme.name === 'Boomer') && 'color: white;' }
    ${ props => props.theme.name === 'Boomer' && 'text-shadow: none; ' }
    ${ props => props.theme.name === 'Christmas' && 'filter: brightness(1.7) saturate(1.3);' }

    ${ props => props.$secret && css`
      cursor: pointer;

      &:hover {
        text-shadow: 0px 0px 10px yellow;
      }
  ` }
  }
`;

const Username = styled.div`
  display: flex;
  align-items: center;

  > h2 {
    font-size: 1.2rem;
    color: white;
    text-shadow: 0px 3px 3px ${ props => props.theme.colors.shadowDefault };
    position: relative;
    margin: -2px 6px 2px;
  }
`;

interface AdminButtonStyleProps {
  $toggled: boolean;
}

const AdminButton = styled.button<AdminButtonStyleProps>`
  ${ button }
  ${ filterButton }
  position: relative;
  min-height: 32px;
  border-width: 1px;
  font-size: 0.8rem;
  margin: 0 6px;
  background-color: ${ props => props.theme.colors.bg };


  ${ props => props.$toggled && `background-color: ${ props.theme.colors.buttonHighlighted };` }
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
    'DiscordStoleOurBot',
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
          <Title $secret={ title === 'he said the thing' }>
            <h1 role='presentation' onClick={ playSecretSound }>{ title }</h1>
          </Title>
          <Username>
            { user.role === 'admin' && <AdminButton $toggled={ showAdminPanel } onClick={ () => setShowAdminPanel(!showAdminPanel) }>Admin</AdminButton> }
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
