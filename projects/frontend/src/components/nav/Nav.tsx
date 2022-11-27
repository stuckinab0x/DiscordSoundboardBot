import React, { FC, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import useUser from '../../hooks/use-user';
import AvatarContainer from './AvatarContainer';
import ChristmasLights from '../decorative/ChristmasLights';
import ChristmasLeaves from '../decorative/ChristmasLeaves';

const NavMain = styled.div`
  background-color: ${ props => props.theme.colors.nav };
  box-shadow: 0px 5px 5px 2px ${ props => props.theme.colors.shadowDefault };
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 100%;

  z-index: 20;
`;

const UsaNavImg = styled.img`
  position: absolute;
  left: 670px;
  bottom: 0;
  height: 90px;
  width: auto;
`;

const NavLeft = styled.div`
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  margin-left: 20px;

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
    z-index: 50;
  
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
    z-index: 50;
  }
`;

function getTitleFromTheme(themeName: string) {
  if (themeName === 'america') return 'DiscordSoundboardBot, FUCK YEAH';
  if (themeName === 'halloween') return 'DiscordSpookboardBot';
  if (themeName === 'christmas') return 'DiscordSoundboardClaus';
  return 'DiscordSoundboardBot';
}

const Nav: FC = () => {
  const user = useUser();
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const theme = useTheme();

  return (
    <NavMain>
      { theme.name === 'america' ? <UsaNavImg src='usanav.png' /> : null }
      { theme.name === 'christmas' ? [0, 1].map(x => <ChristmasLeaves key={ x } />) : null }
      { theme.name === 'christmas' ? <ChristmasLights /> : null }
      <NavLeft>
        <Title>
          <h1>{ getTitleFromTheme(theme.name) }</h1>
        </Title>
        <Username>
          <h2>
            { user.name }
          </h2>
        </Username>
      </NavLeft>
      <AvatarContainer showLogoutMenu={ showLogoutMenu } setShowLogoutMenu={ setShowLogoutMenu } />
    </NavMain>
  );
};

export default Nav;
