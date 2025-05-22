import { FC } from 'react';
import { useDetectClickOutside } from 'react-detect-click-outside';
import styled from 'styled-components';
import useUser from '../../hooks/use-user';
import LogoutMenu from './LogoutMenu';

const AvatarContainerMain = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  
  > img {
    width: 40px;
    margin: 0 6px;
    border-radius: 4px;
    border: 1px solid ${ props => props.theme.colors.accent };
    overflow: hidden;
    box-shadow: 3px 3px 5px ${ props => props.theme.colors.shadowDefault };
    cursor: pointer;
  }

  > img:hover {
    box-shadow: 0px 0px 3px 2px ${ props => props.theme.colors.accent };
  }
`;

interface AvatarContainerProps {
  showLogoutMenu: boolean;
  setShowLogoutMenu: (show: boolean) => void;
}

const AvatarContainer: FC<AvatarContainerProps> = ({ showLogoutMenu, setShowLogoutMenu }) => {
  const user = useUser();
  const ref = useDetectClickOutside({ onTriggered: () => { if (showLogoutMenu) setShowLogoutMenu(false); } });

  return (
    <AvatarContainerMain>
      <img
        ref={ ref }
        src={ `https://cdn.discordapp.com/avatars/${ user.id }/${ user.avatarId }.png` }
        className="avatar"
        alt=""
        role="presentation"
        onClick={ () => setShowLogoutMenu(!showLogoutMenu) }
      />
      { showLogoutMenu && <LogoutMenu /> }
    </AvatarContainerMain>
  );
};

export default AvatarContainer;
