import { createGlobalStyle } from 'styled-components';
import { xmasPlaidBG, flagStripesBg } from './mixins';

const GlobalStyle = createGlobalStyle`
  html {
    font-size: 14pt;
  }
   
  html, body {
    overflow-x: hidden;
    height: 100%;
  }

  body {
    font-family: ${ props => props.theme.font };
    color: white;
    background-color: ${ props => props.theme.colors.bg };
    margin: 0;

    button, input {
      font-family: ${ props => props.theme.font };
      font-size: 1rem;
    }

    ${ props => props.theme.name === 'Christmas' && xmasPlaidBG }
    ${ props => props.theme.name === 'America' && flagStripesBg }

    #root {
      display: flex;
      height: 100%;
    }

    h1 {
      color: ${ props => props.theme.colors.accent }
    }
  } 

  @media only screen and (max-width: ${ props => props.theme.params.widthSelector2 }px) {
    html {
      font-size: 12pt;
    }
  }

  *:focus {
    outline: none;
  }
`;

export default GlobalStyle;
