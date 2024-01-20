import { FC } from 'react';
import styled, { useTheme } from 'styled-components';

const SnowFlakesMain = styled.div`
  > div {
    color: #fff;
    color: ${ props => props.theme.name === 'Halloween' ? '#000' : '#fff' };
    ${ props => props.theme.name === 'Halloween' && 'opacity: 0.6' };
    font-size: 1em;
    font-family: Arial, sans-serif;
    text-shadow: 0 0 5px #000;
  }

  @-webkit-keyframes snowflakes-fall {
      0% {
          top: -10%;
      }

      100% {
          top: 100%;
      }
  }

  @-webkit-keyframes snowflakes-shake {
      0%{
          -webkit-transform: translateX(0px);
          transform: translateX(0px);
      }

      50% {
          -webkit-transform: translateX(80px);
          transform: translateX(80px);
      }

      100% {
          -webkit-transform: translateX(0px);
          transform: translateX(0px);
      }
  }

  @keyframes snowflakes-fall {
    0% {
      top: -10%;
    }

    100% {
      top: 100%;
    }
  }

  @keyframes snowflakes-shake {
    0%{
      transform: translateX(0px);
    }

    50% {
      transform: translateX(80px);
    }

    100% {
      transform: translateX(0px);
    }
  }

  > div {
      position: fixed;
      top: -10%;
      z-index: 9999;
      -webkit-user-select:none;
      -moz-user-select:none;
      -ms-user-select:none;
      user-select:none;
      cursor:default;

      -webkit-animation-name: snowflakes-fall, snowflakes-shake;
      -webkit-animation-duration: 10s, 3s;
      -webkit-animation-timing-function: linear, ease-in-out;
      -webkit-animation-iteration-count: infinite, infinite;
      -webkit-animation-play-state: running, running;

      animation-name: snowflakes-fall, snowflakes-shake;
      animation-duration: 10s, 3s;
      animation-timing-function: linear, ease-in-out;
      animation-iteration-count: infinite, infinite;
      animation-play-state: running, running;
  }
  > div:nth-of-type(0) {
      left: 1%;
      -webkit-animation-delay: 0s, 0s;
      animation-delay: 0s, 0s;
  }
  > div:nth-of-type(1) {
      left: 10%;
      -webkit-animation-delay: 1s, 1s;
      animation-delay: 1s, 1s;
  }
  > div:nth-of-type(2) {
      left: 20%;
      -webkit-animation-delay: 6s, 0.5s;
      animation-delay: 6s, 0.5s;
  }
  > div:nth-of-type(3) {
      left: 30%;
      -webkit-animation-delay: 4s, 2s;
      animation-delay: 4s, 2s;
  }
  > div:nth-of-type(4) {
      left: 40%;
      -webkit-animation-delay: 2s, 2s;
      animation-delay: 2s, 2s;
  }
  > div:nth-of-type(5) {
      left: 50%;
      -webkit-animation-delay: 8s, 3s;
      animation-delay: 8s, 3s;
  }
  > div:nth-of-type(6) {
      left: 60%;
      -webkit-animation-delay: 6s, 2s;
      animation-delay: 6s, 2s;
  }
  > div:nth-of-type(7) {
      left: 70%;
      -webkit-animation-delay: 2.5s, 1s;
      animation-delay: 2.5s, 1s;
  }
  > div:nth-of-type(8) {
      left: 80%;
      -webkit-animation-delay: 1s, 0s;
      animation-delay: 1s, 0s;
  }
  > div:nth-of-type(9) {
      left: 90%;
      -webkit-animation-delay: 3s, 1.5s;
      animation-delay: 3s, 1.5s;
  }
  > div:nth-of-type(10) {
      left: 25%;
      -webkit-animation-delay: 2s, 0s;
      animation-delay: 2s, 0s;
  }
  > div:nth-of-type(11) {
      left: 65%;
      -webkit-animation-delay: 4s, 2.5s;
      animation-delay: 4s, 2.5s;
  }
`;

const Snowflakes: FC = () => {
  const { name: themeName } = useTheme();

  return (
    <SnowFlakesMain aria-hidden="true">
      { Array.from(Array(12).keys()).map(x => <div key={ x }>{ themeName === 'Halloween' ? '🕷' : '❅' }</div>) }
    </SnowFlakesMain>
  );
};

export default Snowflakes;
