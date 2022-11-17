import { css } from 'styled-components';
import theme from './theme';

export const button = css`
  cursor: pointer;

  &:active {
    background-color: white;
    color: #9686fc;
  }

  @media only screen and (min-width: 780px) {
    &:hover:not(:active) {
      background-color: #7c779e;
    }
}
`;

export const filterButton = css`
  min-height: 42px;
  font-weight: bold;
  color: white;
  border: 5px solid ${ theme.colors.borderDefault };
  border-radius: 6px;
  background-color: ${ theme.colors.innerB };
  margin-right: 5px;

  @media only screen and (max-width: 780px) {
    min-height: 30px;
    font-size: 1.2rem;
    font-weight: normal;
    margin-top: 8px;
    border: 3px solid ${ theme.colors.borderDefault };
    border-radius: 3px;
  }
`;

export const iconButton = css`
  cursor: pointer;
`;

export const textInput = css`
  color: white;
  background-color: ${ theme.colors.innerB };
  font-size: 1.2rem;
  border: 5px solid ${ theme.colors.borderDefault };
  border-radius: 3px;
  margin: 0px 0px 7px;
  width: 100%;


  @media only screen and (max-width: 780px) {
    font-size: 1.6rem;
    border: 3px solid ${ theme.colors.borderDefault };
    border-radius: 2px;
    margin: 0;
  }

  &::placeholder {
    color: rgb(199, 199, 199);
  }
`;

export const buttonRed = css`
  border-color: ${ theme.colors.borderRed };
`;

export const buttonGreen = css`
  border-color: ${ theme.colors.borderGreen };
`;
