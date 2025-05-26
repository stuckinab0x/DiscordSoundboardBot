import { FC, useCallback } from 'react';
import styled, { DefaultTheme, css } from 'styled-components';
import { button, filterButton, textShadowVisibility } from '../../styles/mixins';
import themes from '../../styles/themes';

interface ButtonStyleProps {
  $gradient: string[];
}

const ButtonMain = styled.button<ButtonStyleProps>`
  ${ button }
  ${ filterButton }

  position: relative;
  border-width: 3px;
  width: 100%;
  margin: 2px 0px;
  ${ textShadowVisibility }

  ${ props => css`
    --a: ${ props.$gradient[0] };
    --b: ${ props.$gradient[1] };
    --c: ${ props.$gradient[2] };
    background: var(--a);
    background: linear-gradient(90deg, var(--a) 0%, var(--c) 50%, var(--b) 100%);
  ` }
`;

interface ThemeButtonProps {
  name: string;
  handleClick: (name: string) => void;
}

const ThemeButton: FC<ThemeButtonProps> = ({ name, handleClick }) => {
  const getButtonColors = useCallback((theme: DefaultTheme) => [
    theme.colors.nav,
    theme.colors.accent,
    theme.colors.innerA,
  ], []);

  return (
    <ButtonMain role='presentation' onClick={ () => handleClick(name) } $gradient={ getButtonColors(themes.find(x => x.name === name) || themes[0]) }>
      { name }
    </ButtonMain>
  );
};

export default ThemeButton;
