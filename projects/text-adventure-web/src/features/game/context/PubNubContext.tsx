import { createContext } from 'react';
import PubNub from 'pubnub';

const PubNubContext = createContext<PubNub | null>(null);

export default PubNubContext;
