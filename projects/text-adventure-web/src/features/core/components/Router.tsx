import React, { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';

const Router: FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={ <App /> }>
        <Route path="games/:gameId" />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default Router;
