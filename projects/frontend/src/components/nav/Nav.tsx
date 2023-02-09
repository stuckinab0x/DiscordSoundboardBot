import React, { FC, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import useUser from '../../hooks/use-user';
import AvatarContainer from './AvatarContainer';
import ChristmasLights from '../decorative/ChristmasLights';
import ChristmasLeaves from '../decorative/ChristmasLeaves';
import { button, filterButton } from '../../styles/mixins';

const NavMain = styled.div`
  background-color: ${ props => props.theme.colors.nav };
  box-shadow: 0px 5px 5px 2px ${ props => props.theme.colors.shadowDefault };
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 100%;

  z-index: 21;
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

const Title = styled.div`
  > h1 {
    ${ props => props.theme.name === 'america' && 'color: white;' }
    font-size: 2rem;
    text-shadow: 0px 3px 3px ${ props => props.theme.colors.shadowDefault };
    position: relative;

    ${ props => props.theme.name === 'christmas' && 'filter: brightness(1.7) saturate(1.3);' }
  }
  
  @media only screen and (max-width: 780px) {
    max-height: 20px;
  }
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

function getTitleFromTheme(themeName: string) {
  if (themeName === 'america') return 'DiscordSoundboardBot, FUCK YEAH';
  if (themeName === 'halloween') return 'DiscordSpookboardBot';
  if (themeName === 'christmas') return 'DiscordSoundboardClaus';
  return 'DiscordSoundboardBot';
}

interface NavProps {
  showAdminPanel: boolean;
  setShowAdminPanel: (show: boolean) => void;
}

const Nav: FC<NavProps> = ({ showAdminPanel, setShowAdminPanel }) => {
  const user = useUser();
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const theme = useTheme();

  return (
    <NavMain>
      { theme.name === 'america' && <UsaNavImg src='usanav.png' /> }
      { theme.name === 'christmas' ? (
        <LeavesContainer>
          { [0, 1].map(x => <ChristmasLeaves key={ x } />) }
        </LeavesContainer>
      ) : null }
      { theme.name === 'christmas' && <ChristmasLights /> }
      <TitleAndUsername>
        <Title>
          <h1>{ getTitleFromTheme(theme.name) }</h1>
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
