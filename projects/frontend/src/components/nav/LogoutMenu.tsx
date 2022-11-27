import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import LogoutPointer from './LogoutPointer';
import { button } from '../../styles/mixins';

const LogOutMenuMain = styled.div`
  position: absolute;
  top: 90px;
  left: -18px;

  @media only screen and (max-width: 780px) {
    top: 84px;
    left: 0px;
  }

  button {
    ${ button }

    color: white;
    background-color: ${ props => props.theme.colors.innerB };
    border: 2px solid ${ props => props.theme.colors.borderDefault };
    border-width: 2px;
    border-radius: 3px;
    box-shadow: 1.5px 1.5px 6px 0.8px ${ props => props.theme.colors.shadowDefault };
    min-height: 32px;
  }
`;

const LogoutMenu: FC = () => (
  <LogOutMenuMain>
    <LogoutPointer />
    <Link to="/logout">
      <button type="button">log out</button>
    </Link>
  </LogOutMenuMain>
);

export default LogoutMenu;
