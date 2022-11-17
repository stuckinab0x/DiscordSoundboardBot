import React, { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import Logout from '../pages/Logout';

const Router: FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={ <App /> } />
      <Route path="/logout" element={ <Logout /> } />
    </Routes>
  </BrowserRouter>
);

export default Router;
