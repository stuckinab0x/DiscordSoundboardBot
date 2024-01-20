import { FC } from 'react';
import styled, { css } from 'styled-components';
import { CSSTransition, TransitionStatus } from 'react-transition-group';

interface NotifcationStyleProps {
  state: TransitionStatus;
  color: string;
}

const transition = css`
  opacity: 0;
  transition: opacity 2.5s ease-in;
`;

const NotificationText = styled.h2<NotifcationStyleProps>`
  ${ props => (props.state === 'exiting' || props.state === 'exited') && transition };
  color: ${ props => props.color || props.theme.colors.borderGreen };
`;

interface NotificationProps {
  show: boolean;
  textProps: { text: string, color: string }
}

const Notification: FC<NotificationProps> = ({ show, textProps: { text, color } }) => (
  <CSSTransition in={ show } timeout={ 2500 } unmountOnExit>
    { state => <NotificationText state={ state } color={ color }>{ text }</NotificationText> }
  </CSSTransition>
);

export default Notification;
