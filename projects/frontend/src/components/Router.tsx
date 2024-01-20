import { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import Logout from '../pages/Logout';
import SWRProvider from '../providers/SWRProvider';
import PrefsProvider from '../contexts/prefs-context';

const Router: FC = () => (
  <BrowserRouter>
    <SWRProvider>
      <PrefsProvider>
        <Routes>
          <Route path="/" element={ <App /> } />
          <Route path="/logout" element={ <Logout /> } />
        </Routes>
      </PrefsProvider>
    </SWRProvider>
  </BrowserRouter>
);

export default Router;
