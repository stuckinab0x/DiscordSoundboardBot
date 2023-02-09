import express from 'express';
import logger, { requestLogger } from '../logger';
import Environment from '../environment';

type SoundRequestSubscriber = (userID: string, soundId: string) => void;
type SkipRequestSubscriber = (userID: string, skipAll: boolean) => void;

export default class SoundRequestServer {
  constructor(port: number, private readonly environment: Environment) {
    this.createServer(port);
  }

  private soundSubscribers: SoundRequestSubscriber[] = [];
  private skipSubscribers: SkipRequestSubscriber[] = [];

  subscribeToSoundRequests(subscriber: SoundRequestSubscriber) {
    this.soundSubscribers.push(subscriber);
  }

  subscribeToSkipRequests(subscriber: SkipRequestSubscriber) {
    this.skipSubscribers.push(subscriber);
  }

  private createServer(port: number) {
    const app = express();
    app.use(requestLogger);

    app.get('/', (req, res) => res.sendStatus(204));

    app.use((req, res, next) => {
      if (req.headers.authorization === this.environment.apiKey) return next();
      return res.sendStatus(401);
    });

    app.post('/soundrequest/:userid/:soundid', (req, res) => {
      this.soundSubscribers.forEach(x => x(req.params.userid, req.params.soundid));
      res.sendStatus(204);
    });

    app.post('/skip/:all/:userid', (req, res) => {
      logger.info(`Server request to skip. Skip all: ${ req.params.all }`);
      this.skipSubscribers.forEach(x => x(req.params.userid, Boolean(req.params.all)));
      res.sendStatus(204);
    });

    app.listen(port, () => {
      logger.info(`Sound request server listening on port ${ port }`);
    });
  }
}
