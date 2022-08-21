import PubNub from 'pubnub';
import environment from './environment';
import { Router } from 'express';

if (!environment.pubnub.publishKey || !environment.pubnub.subscribeKey || !environment.pubnub.secretKey)
  throw new Error(`PubNub configuration is invalid: ${ JSON.stringify(environment.pubnub) }`);

const pubnub = new PubNub({
  publishKey: environment.pubnub.publishKey,
  subscribeKey: environment.pubnub.subscribeKey,
  userId: 'botman',
  secretKey: environment.pubnub.secretKey,
});

const gameRouter = Router();

gameRouter.get('/:gameId', async (req, res) => {
  const gameId = req.params.gameId;
  const userId = req.cookies.userid;
  const gameChannelPattern = `$game.${ gameId }^`; // Too much

  const accessToken = await pubnub.grantToken({
    authorized_uuid: userId,
    ttl: 60,
    patterns: {
      channels: {
        [gameChannelPattern]: {
          read: true,
        },
      },
    },
  });
});

export default gameRouter;
