import React, { FC } from 'react';
import styled from 'styled-components';

const FullMoonMain = styled.div`
  background: radial-gradient(#f1f1f1 0%, #1a2238 50%);
  background: inherit;
  position: absolute;
  top: -100px;
  pointer-events: none;

  display: flex;
  align-items: center;
  justify-content: center;
  height: 40vh;
  width: 100vw;
`;

const Moon = styled.div`
  position: relative;
  animation: rotation 120s linear infinite;
  background: #F6EDBD;
  box-shadow: 0 0 5rem 0.75rem #f6edbd, 0 0 3rem 0.75rem #ece1a8 inset;
  border-radius: 50%;
  height: 10rem;
  width: 10rem;

  > div {
    position: absolute;
    background: #ece1a8;
  
    &:nth-child(0) {
      top: 1.2rem;
      left: 1.4rem;
      border-radius: 42%;
      transform: rotate(-30deg);
      height: 1.1rem;
      width: 3rem;
    }
    &:nth-child(1) {
      top: 1.6rem;
      left: 1.4rem;
      background: #F6EDBD;
      border-radius: 42%;
      box-shadow: inset -2px 4px 4px 0px #ece1a8;
      transform: rotate(-40deg);
      height: 1.1rem;
      width: 3.7rem;
    }
    &:nth-child(2) {
      top: 2rem;
      left: 3.2rem;
      border-radius: 48%;
      box-shadow: 0 2px 4px 0px #ece1a8;
      height: 1.9rem;
      width: 2.1rem;
    }
    &:nth-child(3) {
      top: 1rem;
      left: 4.3rem;
      border-radius: 48%;
      box-shadow: 0 -2px 4px 0px #ece1a8;
      height: 1.6rem;
      width: 2.4rem;
    }
    &:nth-child(4) {
      top: 5rem;
      left: 0.8rem;
      border-radius: 48%;
      height: 3.6rem;
      width: 5.1rem;
    }
    &:nth-child(5) {
      top: 5rem;
      left: 0.7rem;
      background: #F6EDBD;
      box-shadow: inset 0 -5px 8px 0px #ece1a8;
      border-radius: 38%;
      transform: rotate(15deg);
      height: 3rem;
      width: 6.4rem;
    }
    &:nth-child(6) {
      top: 4rem;
      left: 1rem;
      background: #F6EDBD;
      border-radius: 42%;
      height: 3rem;
      width: 3rem;
    }
    &:nth-child(7) {
      top: 4rem;
      left: 1rem;
      border-radius: 42%;
      box-shadow: 4px 3px 6px 3px #ece1a8;
      height: 3rem;
      width: 3.2rem;
    }
  }

  @keyframes rotation {
    0% {
      transform: translate(-500%, 100%);
      opacity: 0;
    }
    5% {
      opacity: 1;
    }
    75% {
      opacity: 1;
    }
    80% {
      opacity: 0.8;
    }
    95%{
      opacity: 0.8;
    }
    100% {
      transform: translate(500%, -100%);
      opacity: 0;
    }
  }
`;

const FullMoon: FC = () => (
  <FullMoonMain>
    <Moon>
      { Array.from(Array(7).keys()).map(x => <div key={ x } />) }
    </Moon>
  </FullMoonMain>
);

export default FullMoon;
