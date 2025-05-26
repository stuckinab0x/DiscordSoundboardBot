import styled from 'styled-components';
import { button, filterButton, filterButtonMobile, textShadowVisibility } from './mixins';

interface ButtonProps {
  $color?: string;
  $toggled?: boolean;
}

export const ToggleButtonBase = styled.button<ButtonProps>`
  ${ button }
  ${ filterButton }
  ${ filterButtonMobile }
  ${ textShadowVisibility }
  user-select: none;
`;

export const FilterButton = styled(ToggleButtonBase)`
  background-color: ${ props => props.$color };
  opacity: ${ props => props.$toggled ? 1 : 0.5 };
`;

export const OptionsButton = styled(ToggleButtonBase)`
  margin: 2px;
  
  ${ props => props.theme.name === '20XD6' && 'font-size: 11pt;' }

  ${ props => props.$toggled && `background-color: ${ props.theme.colors.buttonHighlighted };` }
`;

export const InnerShadow = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  box-shadow: inset 0px 0px 2px 0 ${ props => props.theme.colors.shadowSoundInner };
  pointer-events: none;
`;

export const CloseBar = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  margin: 0px;
  flex-grow: 1;
  opacity: 0.5;
  background-color: ${ props => props.theme.colors.closeButton };
  box-shadow: 0px 0 2px 0 ${ props => props.theme.colors.shadowDefault };
  border-radius: 2px;
  padding: 5px 0px;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }

  > p {
    display: flex;
    align-items: center;
    color: black;
    font-weight: bold;
    opacity: 0.8;
    margin: 0;
  }
`;

export const AdminPanelDivider = styled.hr`
  background: ${ props => props.theme.colors.accent };
  border: none;
  border-radius: 2px;
  height: 10px;
  width: 470px;
  margin: 2px 0px;

  @media only screen and (max-width: ${ props => props.theme.params.widthSelector2 }px) {
    display: none;
  }
`;
