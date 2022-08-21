import React, { FC, PropsWithChildren, useEffect } from 'react';
import PubNub from 'pubnub';
import PubNubContext from './PubNubContext';

const client = new PubNub({
  publishKey: '',
  subscribeKey: '',
  userId: 'jeff',
});

interface PubNubProviderProps {
  authKey: string;
}

const PubNubProvider: FC<PropsWithChildren<PubNubProviderProps>> = ({ authKey, children }) => {
  useEffect(() => {
    client.setAuthKey(authKey);
  }, [authKey]);

  return <PubNubContext.Provider value={ client }>{ children }</PubNubContext.Provider>;
};

export default PubNubProvider;
