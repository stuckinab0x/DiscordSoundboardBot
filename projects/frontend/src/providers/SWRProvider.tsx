import React, { FC, PropsWithChildren } from 'react';
import { SWRConfig, SWRConfiguration } from 'swr';

const value: SWRConfiguration = { fetcher: (input, init) => fetch(input, init).then(x => x.json()) };

const SWRProvider: FC<PropsWithChildren> = ({ children }) => (
  <SWRConfig value={ value }>
    { children }
  </SWRConfig>
);

export default SWRProvider;
