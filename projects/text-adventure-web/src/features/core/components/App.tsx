import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';

const App: FC = () => (
  <main>
    <Outlet />
  </main>
);

export default App;
