import { FC, useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';

const LogoutStyle = createGlobalStyle`
  html, body {
    height: 100%;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    background-color: #383b43;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0;
  }

  a {
    color: white;
  }
`;

const Logout: FC = () => {
  useEffect(() => {
    fetch('/api/logout', { method: 'POST' });
  }, []);

  return (
    <>
      <LogoutStyle />
      <h1>Bye then</h1>

      <a href="/">Regret</a>
    </>
  );
};

export default Logout;
