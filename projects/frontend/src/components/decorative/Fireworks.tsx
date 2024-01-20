import { FC } from 'react';
import styled from 'styled-components';

const FireworksMain = styled.div`
  z-index: 50;
  
  @keyframes firework {
    0% { transform: translate(var(--x), var(--initialY)); width: var(--initialSize); opacity: 1; }
    50% { width: 0.5vmin; opacity: 1; }
    100% { width: var(--finalSize); opacity: 0; }
  }

  @keyframes fireworkPseudo {
    0% { transform: translate(-50%, -50%); width: var(--initialSize); opacity: 1; }
    50% { width: 0.5vmin; opacity: 1; }
    100% { width: var(--finalSize); opacity: 0; }
  }
 
  
  div,
  div::before,
  div::after
  {
    --initialSize: 0.5vmin;
    --finalSize: 45vmin;
    --particleSize: 0.2vmin;
    --color1: yellow;
    --color2: khaki;
    --color3: white;
    --color4: lime;
    --color5: gold;
    --color6: mediumseagreen;
    --y: -30vmin;
    --x: -50%;
    --initialY: 60vmin;
    content: "";
    animation: firework 5s infinite;
    position: absolute;
    top: 30%;
    left: 50%;
    pointer-events: none;
    transform: translate(-50%, var(--y));
    width: var(--initialSize);
    aspect-ratio: 1;
    background: 
      radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 50% 0%,
      radial-gradient(circle, var(--color2) var(--particleSize), #0000 0) 100% 50%,
      radial-gradient(circle, var(--color3) var(--particleSize), #0000 0) 50% 100%,
      radial-gradient(circle, var(--color4) var(--particleSize), #0000 0) 0% 50%,
      
      /* bottom right */
      radial-gradient(circle, var(--color5) var(--particleSize), #0000 0) 80% 90%,
      radial-gradient(circle, var(--color6) var(--particleSize), #0000 0) 95% 90%,
      radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 90% 70%,
      radial-gradient(circle, var(--color2) var(--particleSize), #0000 0) 100% 60%,
      radial-gradient(circle, var(--color3) var(--particleSize), #0000 0) 55% 80%,
      radial-gradient(circle, var(--color4) var(--particleSize), #0000 0) 70% 77%,
      
      /* bottom left */
      radial-gradient(circle, var(--color5) var(--particleSize), #0000 0) 22% 90%,
      radial-gradient(circle, var(--color6) var(--particleSize), #0000 0) 45% 90%,
      radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 33% 70%,
      radial-gradient(circle, var(--color2) var(--particleSize), #0000 0) 10% 60%,
      radial-gradient(circle, var(--color3) var(--particleSize), #0000 0) 31% 80%,
      radial-gradient(circle, var(--color4) var(--particleSize), #0000 0) 28% 77%,
      radial-gradient(circle, var(--color5) var(--particleSize), #0000 0) 13% 72%,
      
      /* top left */
      radial-gradient(circle, var(--color6) var(--particleSize), #0000 0) 80% 10%,
      radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 95% 14%,
      radial-gradient(circle, var(--color2) var(--particleSize), #0000 0) 90% 23%,
      radial-gradient(circle, var(--color3) var(--particleSize), #0000 0) 100% 43%,
      radial-gradient(circle, var(--color4) var(--particleSize), #0000 0) 85% 27%,
      radial-gradient(circle, var(--color5) var(--particleSize), #0000 0) 77% 37%,
      radial-gradient(circle, var(--color6) var(--particleSize), #0000 0) 60% 7%,
      
      /* top right */
      radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 22% 14%,
      radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 45% 20%,
      radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 33% 34%,
      radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 10% 29%,
      radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 31% 37%,
      radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 28% 7%,
      radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 13% 42%
      ;
    background-size: var(--initialSize) var(--initialSize);
    background-repeat: no-repeat;
  }

  div::before {
    --x: -50%;
    --y: -50%;
    --initialY: -50%;
    transform: translate(-20vmin, -2vmin) rotate(40deg) scale(1.3) rotateY(40deg);
    transform: translate(-50%, -50%) rotate(40deg) scale(1.3) rotateY(40deg);
    animation: fireworkPseudo 3s infinite;
  }

  div::after {
    --x: -50%;
    --y: -50%;
    --initialY: -50%;
    transform: translate(44vmin, -50%) rotate(170deg) scale(1.15) rotateY(-30deg);
    transform: translate(-50%, -50%) rotate(170deg) scale(1.15) rotateY(-30deg);
    animation: fireworkPseudo 3s infinite;
  }

  div:nth-child(2) {
    --x: 30vmin;
  }

  div:nth-child(2),
  div:nth-child(2)::before,
  div:nth-child(2)::after {
    --color1: pink;
    --color2: violet;
    --color3: fuchsia;
    --color4: orchid;
    --color5: plum;
    --color6: lavender;  
    --finalSize: 40vmin;
    left: 30%;
    top: 30%;
    animation-delay: -0.25s;
  }

  div:nth-child(3) {
    --x: -30vmin;
    --y: -50vmin;
  }

  div:nth-child(3),
  div:nth-child(3)::before,
  div:nth-child(3)::after {
    --color1: cyan;
    --color2: lightcyan;
    --color3: lightblue;
    --color4: PaleTurquoise;
    --color5: SkyBlue;
    --color6: lavender;
    --finalSize: 35vmin;
    left: 70%;
    top: 30%;
    animation-delay: -0.4s;
  }
`;

const Fireworks: FC = () => (
  <FireworksMain>
    { [0, 1, 2].map(x => <div key={ x } />) }
  </FireworksMain>
);

export default Fireworks;
