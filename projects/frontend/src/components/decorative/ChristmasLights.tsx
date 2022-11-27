import React, { FC } from 'react';
import styled from 'styled-components';

const Wire = styled.div`
  text-align: center;
  white-space: nowrap;
  position: absolute;
  padding: 0;
  width: 100%;
  top: -95px;
  border-bottom: 3px solid #222;
  height: 100px;
  z-index: 2;

  pointer-events: none;

  > li {
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
    display: block;
    width: 15px;
    height: 30px;
    border-radius: 50%;
    margin: 0px 15px;
    top: 102px;
    display: inline-block;
    animation-duration: 4s;
    animation-fill-mode: both;
    animation-iteration-count:infinite;
    animation-name: even-flash;
  
    &:nth-child(odd) {
      animation-name: odd-flash;
    }
    
    > &:before {
      content: "";
      position: absolute;
      width: 14px;
      height: 10px;
      border-radius: 4px;
      top: -5px;
      left: 0px;
      background: #444;
    }
  }

  @keyframes even-flash {
    0%, 100% {
        background: rgba(22, 248, 37, 1);
        box-shadow: 0px 2px 20px 4px rgba(22, 248, 37, 1);
    }
    50% {
        background: rgba(22, 248, 37, 0.5);
        box-shadow: 0px 2px 20px 4px rgba(22, 248, 37, 0.3);
    }
}

@keyframes odd-flash {
    50% {
        background: rgba(248, 14, 14, 1);
        box-shadow: 0px 2px 20px 4px rgba(248, 14, 14, 1);
    }
    0%,100% {
        background: rgba(248, 14, 14, 0.5);
        box-shadow: 0px 2px 20px 4px rgba(248, 14, 14, 0.3);
    }
  }

  @media only screen and (max-width: 780px) {
    display: none;
  }
`;

const ChristmasLights: FC = () => (
  <Wire>
    { Array.from(Array(40).keys()).map(x => <li key={ x } />) }
  </Wire>
);

export default ChristmasLights;
