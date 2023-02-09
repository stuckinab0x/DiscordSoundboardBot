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
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    color: white;
    background-color: ${ props => props.theme.colors.bg };
    margin: 0;

    ${ props => props.theme.name === 'christmas' && xmasPlaidBG }
    ${ props => props.theme.name === 'america' && flagStripesBg }

    #root {
      display: flex;
      height: 100%;
    }

    h1 {
      color: ${ props => props.theme.colors.borderDefault }
    }
  } 

  @media only screen and (max-width: 780px) {
    html {
      font-size: 8pt;
    }
  }

  *:focus {
    outline: none;
  }
`;

export default GlobalStyle;
