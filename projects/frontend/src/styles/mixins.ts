import { css } from 'styled-components';

export const button = css`
  cursor: pointer;

  &:active {
    background-color: white;
    color: ${ props => props.theme.colors.borderDefault };
  }

  @media only screen and (min-width: 780px) {
    &:hover:not(:active) {
      filter: brightness(1.1);
    }
}
`;

export const filterButton = css`
  min-height: 42px;
  font-weight: bold;
  color: white;
  border: 5px solid ${ props => props.theme.colors.borderDefault };
  border-radius: 6px;
  background-color: ${ props => props.theme.colors.innerB };
  margin-right: 5px;

  &:last-child {
    margin-right: 0px;
  }
`;

export const filterButtonMobile = css`
  @media only screen and (max-width: 780px) {
    min-height: 30px;
    font-size: 1.2rem;
    font-weight: normal;
    margin-top: 8px;
    border: 3px solid ${ props => props.theme.colors.borderDefault };
    border-radius: 3px;
  }
`;

export const iconButton = css`
  cursor: pointer;
`;

export const textInput = css`
  color: white;
  background-color: ${ props => props.theme.colors.innerB };
  font-size: 1.2rem;
  border: 5px solid ${ props => props.theme.colors.borderDefault };
  border-radius: 3px;
  margin: 0px 0px 7px;
  width: 100%;

  &::placeholder {
    color: rgb(199, 199, 199);
  }
`;

export const textInputMobile = css`
  @media only screen and (max-width: 780px) {
    font-size: 1.6rem;
    border: 3px solid ${ props => props.theme.colors.borderDefault };
    border-radius: 2px;
    margin: 0;
  }
`;

export const buttonRed = css`
  border-color: ${ props => props.theme.colors.borderRed };
`;

export const buttonGreen = css`
  border-color: ${ props => props.theme.colors.borderGreen };
`;

export const candyCaneBG = css`
  background-color: #e5e5f7;
  background: repeating-linear-gradient( 45deg, #f74444, #f74444 10px, #e5e5f7 5px, #e5e5f7 25px );
`;

export const xmasPlaidBG = css`
  background-color: rgba(9, 23, 9, 1);
  background-image:
    linear-gradient(
      rgba(84, 140, 81, 0.4) 0%,
      rgba(84, 140, 81, 0.4) 50%,
      rgba(84, 140, 81, 0.7) 50%,
      rgba(84, 140, 81, 0.7) 100%
    ),
  linear-gradient(
    90deg,
    rgba(84, 140, 81, 0.4) 0%,
    rgba(84, 140, 81, 0.4) 50%,
    rgba(84, 140, 81, 0.7) 50%,
    rgba(84, 140, 81, 0.7) 100%
  );
  background-size: 100px 100px;
`;

export const flagStripesBg = css`
  background-color: #e5e5f7;
  background: repeating-linear-gradient(#f74444, #f74444 30px, #e5e5f7 30px, #e5e5f7 60px );
`;

export const textShadowVisibility = css`
  text-shadow: 1px 1px 4px ${ props => props.theme.colors.shadowDefault };
`;
