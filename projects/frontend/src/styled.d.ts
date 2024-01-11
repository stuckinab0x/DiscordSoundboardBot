import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    name: string;
    seasonal: boolean;
    font: string;
    colors: {
      accent: string;
      bg: string;
      nav: string;
      innerA: string;
      innerB: string;
      borderGold: string;
      borderRed: string;
      borderGreen: string;
      buttonHighlighted: string;
      closeButton: string;
      favStarSet: string;
      shadowDefault: string;
      shadowSoundInner: string;
      volumeSliderFill: string;
      volumeSliderThumb: string;
    },
  }
}
