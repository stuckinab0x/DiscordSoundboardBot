import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
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

  &::after {
    content: '';
    position: absolute;
    top: -12px;
    left: 37.5px;
    border: solid 5px transparent;
    border-bottom-color: ${ props => props.theme.colors.borderDefault };
    border-bottom-width: 7px;
    border-right-width: 14px;
    border-left-width: 14px;
  }
`;

const LogoutMenu: FC = () => (
  <LogOutMenuMain>
    <Link to="/logout">
      <button type="button">log out</button>
    </Link>
  </LogOutMenuMain>
);

export default LogoutMenu;
