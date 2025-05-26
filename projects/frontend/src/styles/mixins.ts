import { css } from 'styled-components';

export const button = css`
  cursor: pointer;

  &:active {
    background-color: white;
    color: ${ props => props.theme.colors.accent };
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
  border: none;
  box-shadow: 0px 0 2px 0 ${ props => props.theme.colors.shadowDefault };
  border-radius: 2px;
  background-color: ${ props => props.theme.colors.innerB };
  position: relative;
  
`;

export const filterButtonMobile = css`
  @media only screen and (max-width: ${ props => props.theme.params.widthSelector2 }px) {
    min-height: 30px;
  }
`;

export const textInput = css`
  color: white;
  background-color: ${ props => props.theme.colors.innerB };
  font-size: 1.2rem;
  border: none;
  border-radius: 2px;
  width: 100%;

  &::placeholder {
    color: rgb(199, 199, 199);
  }
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
