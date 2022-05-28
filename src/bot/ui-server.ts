import express from 'express';
import logger, { requestLogger } from '../logger';
import filesService from './files-service';
import environment from '../environment';

type SoundRequestSubscriber = (userID: string, soundRequest: string) => void;
type SkipRequestSubscriber = (userID: string, skipAll: boolean) => void;

export default class SoundRequestServer {
  constructor(port: number) {
    this.createServer(port);
  }

  private soundSubscribers: SoundRequestSubscriber[] = [];
  private skipSubscribers: SkipRequestSubscriber[] = [];

  onSoundRequest(subscriber: SoundRequestSubscriber) {
    this.soundSubscribers.push(subscriber);
  }

  onSkipRequest(subscriber: SkipRequestSubscriber) {
    this.skipSubscribers.push(subscriber);
  }

  private async getSounds() {
    const files = await filesService.files;
    const soundNames = files.map(x => x.name);
    return soundNames;
  }

  private async createServer(port: number) {
    const app = express();
    app.use(requestLogger);

    app.get('/', (req, res) => res.sendStatus(204));

    app.use(express.text());
    app.use(express.json());

    app.use((req, res, next) => {
      if (req.headers.authorization === environment.apiKey) return next();
      return res.sendStatus(401);
    });

    app.get('/soundlist', async (req, res) => {
      await this.getSounds()
        .then(data => {
          res.send(JSON.stringify(data));
        });
    });

    app.post('/soundrequest', (req, res) => {
      this.soundSubscribers.forEach(x => x(req.body.userID, req.body.soundRequest));
      res.sendStatus(204);
    });

    app.post('/skip', (req, res) => {
      logger.info(`Server request to skip. Skip all: ${ req.body.skipAll }`);
      this.skipSubscribers.forEach(x => x(req.body.userID, req.body.skipAll));
      res.sendStatus(204);
    });

    app.listen(port, () => {
      logger.info(`Sound request server listening on port ${ port }`);
    });
  }
}
