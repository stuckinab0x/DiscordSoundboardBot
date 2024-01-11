import React, { FC, useCallback } from 'react';
import styled, { DefaultTheme, css } from 'styled-components';
import { button, filterButton, textShadowVisibility } from '../../styles/mixins';
import themes from '../../styles/themes';
import { InnerShadow } from '../../styles/components';

interface ButtonStyleProps {
  gradient: string[];
}

const ButtonMain = styled.button<ButtonStyleProps>`
  ${ button }
  ${ filterButton }

  position: relative;
  border-width: 3px;
  width: 100%;
  margin: 2px 0px;
  box-shadow:  0px 0px 10px 0px ${ props => props.theme.colors.shadowDefault };
  ${ textShadowVisibility }

  ${ props => css`
    --a: ${ props.gradient[0] };
    --b: ${ props.gradient[1] };
    background: var(--a);
    background: linear-gradient(90deg, var(--a) 0%, var(--b) 100%);
  ` }

  @media only screen and (max-width: 780px) {
    font-size: 1.4rem;
  }
`;

interface ThemeButtonProps {
  name: string;
  handleClick: (name: string) => void;
}

const ThemeButton: FC<ThemeButtonProps> = ({ name, handleClick }) => {
  const getButtonColors = useCallback((theme: DefaultTheme) => [
    theme.colors.accent,
    theme.colors.innerA,
  ], []);

  return (
    <ButtonMain role='presentation' onClick={ () => handleClick(name) } gradient={ getButtonColors(themes.find(x => x.name === name) || themes[0]) }>
      <InnerShadow />
      { name }
    </ButtonMain>
  );
};

export default ThemeButton;
