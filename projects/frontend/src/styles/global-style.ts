import { createGlobalStyle } from 'styled-components';
import theme from './theme';

const GlobalStyle = createGlobalStyle`
  html {
    font-size: 14pt;
  }
   
  html, body {
    height: 100%;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    color: white;
    background-color: ${ theme.colors.bg };
    display: flex;
    width: 100%;
    margin: 0;

    #root {
      width: 100%;
    }

    h1 {
      color: ${ theme.colors.borderDefault }
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
