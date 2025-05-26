import { FC, useCallback, useState, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import styled from 'styled-components';
import { CSSTransition, TransitionStatus } from 'react-transition-group';
import Sound from '../../models/sound';
import SearchBar from '../SearchBar';
import PanelSound from './PanelSound';
import PanelInfoContainer from './PanelInfoContainer';
import Notification from './Notification';
import { textShadowVisibility } from '../../styles/mixins';
import useSoundPreview from '../../hooks/use-sound-preview';
import { CloseBar } from '../../styles/components';

interface AdminStyleProps {
  $state?: TransitionStatus;
}

const AdminPanelMain = styled.div<AdminStyleProps>`
  position: absolute;
  transition: bottom 0.4s ease-out;
  bottom: ${ props => props.$state === 'entered' || props.$state === 'entering' ? '0px' : '-110vh' };
  transition: top 0.4s ease-out;
  top: ${ props => props.$state === 'entered' || props.$state === 'entering' ? '60px' : '100vh' };
  display: flex;
  width: 100%;
  flex-direction: column;
  overflow-y: hidden;
  z-index: 100;
  background-color: ${ props => props.theme.colors.bg };
`;

const AdminFeatures = styled.div`
  padding: 16px;
  background-color: ${ props => props.theme.colors.innerA };

  @media only screen and (max-width: ${ props => props.theme.params.widthSelector2 }px) {
    padding: 12px;
  }
`;

const FeaturesHeader = styled.div`
  display: flex;

  > h2 {
    ${ textShadowVisibility }
    margin: 10px 20px 10px 0px;

    @media only screen and (max-width: ${ props => props.theme.params.widthSelector2 }px) {
      margin-top: 10px;
    }

    &:first-child {
      color: ${ props => props.theme.colors.accent };
    }
  }
`;

const LowerContainer = styled.div`
  display: flex;
  overflow-y: hidden;
  flex-grow: 1;

  @media only screen and (max-width: ${ props => props.theme.params.widthSelector2 }px) {
    flex-direction: column;
  }
`;

const SoundsContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  padding: 10px;
  border-right: 5px solid ${ props => props.theme.colors.accent };

  &::-webkit-scrollbar {
    width: 15px;
    background: ${ props => props.theme.colors.innerB };
  }

  &::-webkit-scrollbar-thumb {
    background: ${ props => props.theme.colors.innerA };
  }

  @media only screen and (max-width: ${ props => props.theme.params.widthSelector2 }px) {
    border-right: none;
    border-bottom: 5px solid ${ props => props.theme.colors.accent };
    box-shadow: 0 0 10px 0 ${ props => props.theme.colors.shadowDefault } inset;
    padding: 15px;
  }
`;

interface AdminPanelProps {
  show: boolean;
  adminPanelClosed: () => void;
}

const AdminPanel: FC<AdminPanelProps> = ({ show, adminPanelClosed }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSound, setSelectedSound] = useState<Sound | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationProps, setNotificationProps] = useState({ text: '', color: '' });

  const { data: soundsData, error } = useSWR<{ introSound: string | undefined, sounds: Sound[] }>('/api/sounds');
  const { soundPreview, setPreviewVolume } = useSoundPreview();

  useEffect(() => {
    if (selectedSound)
      setSelectedSound(soundsData?.sounds.find(x => x.id === selectedSound.id) ?? null);
  }, [soundsData?.sounds]);

  const visibleSounds = useMemo(
    () => soundsData?.sounds.filter(x => x.name.toUpperCase().includes(searchTerm)),
    [soundsData?.sounds, searchTerm],
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
          <AdminPanelMain $state={ state }>
            <AdminFeatures>
              <CloseBar onClick={ () => adminPanelClosed() }>
                <p>Close (Esc)</p>
              </CloseBar>
              <FeaturesHeader>
                <h2>TOP SECRET ADMIN ZONE</h2>
                <Notification show={ showNotification } textProps={ { text: notificationProps.text, color: notificationProps.color } } />
              </FeaturesHeader>
              <SearchBar setSearchTerm={ setSearchTerm } focusOnEnter />
            </AdminFeatures>
            <LowerContainer>
              <SoundsContainer>
                { visibleSounds.map(x =>
                  (
                    <PanelSound
                      key={ x.id }
                      sound={ x }
                      selectedSoundId={ selectedSound?.id }
                      setSelectedSound={ setSelectedSound }
                      soundPreview={ () => soundPreview(x.url, x.volume) }
                    />
                  ))}
              </SoundsContainer>
              <PanelInfoContainer
                selectedSound={ selectedSound }
                setSelectedSound={ setSelectedSound }
                setPreviewVolume={ setPreviewVolume }
                setNotification={ setNotification }
              />
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
