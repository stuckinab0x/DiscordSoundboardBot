import React, { FC, useCallback, useState, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import styled from 'styled-components';
import { CSSTransition, TransitionStatus } from 'react-transition-group';
import Sound from '../../models/sound';
import SearchContainer from '../features/SearchContainer';
import PanelSound from './PanelSound';
import PanelInfoContainer from './PanelInfoContainer';
import Notification from './Notification';
import { textShadowVisibility } from '../../styles/mixins';

interface AdminStyleProps {
  state?: TransitionStatus;
}

const AdminPanelMain = styled.div<AdminStyleProps>`
  position: absolute;
  transition: bottom 0.4s ease-out;
  bottom: ${ props => props.state === 'entered' || props.state === 'entering' ? '0px' : '-110vh' };
  transition: top 0.4s ease-out;
  top: ${ props => props.state === 'entered' || props.state === 'entering' ? '104px' : '100vh' };
  display: flex;
  width: 100%;
  flex-direction: column;
  overflow-y: hidden;
  z-index: 100;
  background-color: ${ props => props.theme.colors.bg };
`;

const AdminFeatures = styled.div`
  padding: 12px 30px 20px 30px;
  box-shadow: 0px 5px 5px 2px ${ props => props.theme.colors.shadowDefault };
`;

const FeaturesHeader = styled.div`
  display: flex;
  align-items: left;

  > h2 {
    ${ textShadowVisibility }
    margin: 18px 20px 10px 0px;

    &:first-child {
      color: ${ props => props.theme.colors.borderDefault };
    }
  }
`;

const CloseBar = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  opacity: 0.5;
  background-color: ${ props => props.theme.colors.borderRed };
  border-radius: 8px;
  padding: 5px 0px;
  cursor: pointer;
  box-shadow: 0px 3px 4px ${ props => props.theme.colors.shadowDefault };

  &:hover {
    opacity: 0.7;
  }

  > p {
    color: black;
    font-weight: bold;
    opacity: 0.8;
    margin: 0;
  }
`;

const LowerContainer = styled.div`
  display: flex;
  overflow-y: hidden;
  flex-grow: 1;

  @media only screen and (max-width: 780px) {
    flex-direction: column;
  }
`;

const SoundsContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  padding: 20px 30px;
  border-right: 5px solid ${ props => props.theme.colors.borderDefault };

  > h2 {
    color: ${ props => props.theme.colors.borderDefault };
    margin: 5px 0px;
    
    ${ textShadowVisibility }
  }

  &::-webkit-scrollbar {
    width: 15px;
    background: ${ props => props.theme.colors.innerB };
  }

  &::-webkit-scrollbar-thumb {
    background: ${ props => props.theme.colors.innerA };
  }

  @media only screen and (max-width: 780px) {
    border-right: none;
    border-bottom: 5px solid ${ props => props.theme.colors.borderDefault };
  }
`;

interface AdminPanelProps {
  show: boolean;
  adminPanelClosed: () => void;
  previewRequest: (soundName: string) => Promise<void>
}

const AdminPanel: FC<AdminPanelProps> = ({ show, adminPanelClosed, previewRequest }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSound, setSelectedSound] = useState<Sound | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationProps, setNotificationProps] = useState({ text: '', color: '' });

  const { data: sounds, error } = useSWR<Sound[]>('/api/sounds');

  const visibleSounds = useMemo(
    () => sounds?.filter(x => x.name.toUpperCase().includes(searchTerm)),
    [sounds, searchTerm],
  );

  const setNotification = useCallback((text: string, color: string) => {
    setNotificationProps({ text, color });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 1400);
  }, []);

  const panelShortcutClose = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape')
      adminPanelClosed();
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', panelShortcutClose, { passive: true });
    return () => document.removeEventListener('keydown', panelShortcutClose);
  }, [panelShortcutClose]);

  useEffect(() => setSearchTerm(''), [show]);

  if (visibleSounds)
    return (
      <CSSTransition in={ show } timeout={ 410 } unmountOnExit>
        { state => (
          <AdminPanelMain state={ state }>
            <AdminFeatures>
              <CloseBar onClick={ () => adminPanelClosed() }>
                <p>Close (Esc)</p>
              </CloseBar>
              <FeaturesHeader>
                <h2>TOP SECRET ADMIN ZONE</h2>
                <Notification show={ showNotification } textProps={ { text: notificationProps.text, color: notificationProps.color } } />
              </FeaturesHeader>
              <SearchContainer setSearchTerm={ setSearchTerm } focusOnEnter />
            </AdminFeatures>
            <LowerContainer>
              <SoundsContainer>
                <h2>Select a sound for info/delete/rename</h2>
                { visibleSounds.map(x => (<PanelSound key={ x.id } sound={ x } selectedSoundId={ selectedSound?.id } setSelectedSound={ setSelectedSound } previewRequest={ previewRequest } />))}
              </SoundsContainer>
              <PanelInfoContainer selectedSound={ selectedSound } setSelectedSound={ setSelectedSound } previewRequest={ previewRequest } setNotification={ setNotification } />
            </LowerContainer>
          </AdminPanelMain>
        )}
      </CSSTransition>
    );
  return (
    <AdminPanelMain>
      { error ? <h1>Something broke eeeeeek</h1> : <h1>Loading yo sounds...</h1> }
    </AdminPanelMain>
  );
};

export default AdminPanel;
