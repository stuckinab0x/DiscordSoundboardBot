import { createGlobalStyle } from 'styled-components';
import { xmasPlaidBG, flagStripesBg } from './mixins';

const GlobalStyle = createGlobalStyle`
  html {
    font-size: 14pt;
  }
   
  html, body {
    height: 100%;
    overflow-x: hidden;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    color: white;
    background-color: ${ props => props.theme.colors.bg };
    display: flex;
    width: 100%;
    margin: 0;
    overflow-x: hidden;

    ${ props => props.theme.name === 'christmas' && xmasPlaidBG }
    ${ props => props.theme.name === 'america' && flagStripesBg }

    #root {
      width: 100%;
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
