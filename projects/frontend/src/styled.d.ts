import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    name: string;
    colors: {
      bg: string;
      nav: string;
      innerA: string;
      innerB: string;
      borderDefault: sring;
      borderGold: string;
      borderRed: string;
      borderGreen: string;
      buttonHover: string;
      buttonHighlighted: string;
      favStarSet: string;
      shadowDefault: string;
      volumeSliderFill: string;
      volumeSliderThumb: string;
    },
  }
}
