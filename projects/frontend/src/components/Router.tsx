import React, { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import Logout from '../pages/Logout';
import SWRProvider from '../providers/SWRProvider';

const Router: FC = () => (
  <BrowserRouter>
    <SWRProvider>
      <Routes>
        <Route path="/" element={ <App /> } />
        <Route path="/logout" element={ <Logout /> } />
      </Routes>
    </SWRProvider>
  </BrowserRouter>
);

export default Router;
