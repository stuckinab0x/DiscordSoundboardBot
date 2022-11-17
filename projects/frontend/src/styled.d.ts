import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      bg: string;
      nav: string;
      innerA: string;
      innerB: string;
      borderDefault: sring;
      borderGold: string;
      borderRed: string;
      borderGreen: string;
      buttonHighlighted: string;
      favStarSet: string;
      shadowDefault: string;
    },
  }
}
