import React, { FC, useState } from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';
import useUser from '../../hooks/use-user';
import AvatarContainer from './AvatarContainer';

const NavMain = styled.div`
  background-color: ${ props => props.theme.colors.nav };
  box-shadow: 0px 5px 5px 2px ${ theme.colors.shadowDefault };
  display: flex;
  justify-content: space-between;
  width: 100%;
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
    font-size: 2rem;
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
  }
`;

const Nav: FC = () => {
  const user = useUser();
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  return (
    <NavMain>
      <NavLeft>
        <Title>
          <h1>DiscordSoundboardBot</h1>
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
