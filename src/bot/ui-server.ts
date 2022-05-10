import express from 'express';
import logger from '../logger';
import filesService from './files-service';
import environment from '../environment';

type SoundRequestSubscriber = (userID: string, soundRequest: string) => void;
type SkipRequestSubscriber = (userID: string, skipAll: boolean) => void;

export default class SoundRequestServer {
  constructor(port: number) {
    this.port = port;
    this.createServer();
  }

  private port: number;
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

  private async createServer() {
    const app = express();
    app.use(express.text());
    app.use(express.json());

    app.get('/', (req, res) => {
      res.writeHead(204);
      res.end();
    });

    app.use((req, res, next) => {
      if (req.headers.authorization === environment.apiKey) return next();
      return res.status(403);
    });

    app.get('/soundlist', async (req, res) => {
      await this.getSounds()
        .then(data => {
          res.send(JSON.stringify(data));
          res.end();
        });
    });

    app.post('/soundrequest', (req, res) => {
      this.soundSubscribers.forEach(x => x(req.body.userID, req.body.soundRequest));
      res.writeHead(204);
      res.end();
    });

    app.post('/skip', (req, res) => {
      logger.info(`Server request to skip. Skip all: ${ req.body.skipAll }`);
      this.skipSubscribers.forEach(x => x(req.body.userID, req.body.skipAll));
      res.writeHead(204);
      res.end();
    });

    app.listen(this.port, () => {
      logger.info(`sound request server listening on port ${ this.port }`);
    });
  }
}
