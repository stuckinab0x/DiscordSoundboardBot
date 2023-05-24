import * as applicationInsights from 'applicationinsights';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { SoundsService } from 'botman-sounds';
import { PrefsService, FavoritesService, TagsService } from 'botman-users';
import { createProxyMiddleware } from 'http-proxy-middleware';
import logger, { requestLogger } from '../logger';
import DiscordAuth from './middlewares/discord-auth';
import soundsRouter from './routes/sounds';
import favoritesRouter from './routes/favorites';
import tagsRouter from './routes/tags';
import prefsRouter from './routes/prefs';
import queueRouter from './routes/queue';
import { WebServerEnvironment } from '../environment';

type SoundRequestSubscriber = (userId: string, soundId: string) => void;
type SkipRequestSubscriber = (userId: string, skipAll: boolean) => void;

export default class WebServer {
  private readonly soundsService: SoundsService;
  private readonly prefsService: PrefsService;
  private readonly favoritesService: FavoritesService;
  private readonly tagsService: TagsService;

  private readonly authURL: string;

  private soundSubscribers: SoundRequestSubscriber[] = [];
  private skipSubscribers: SkipRequestSubscriber[] = [];

  constructor(private readonly environment: WebServerEnvironment) {
    if (environment.environment === 'production') {
      applicationInsights.setup();
      applicationInsights.defaultClient.context.tags[applicationInsights.defaultClient.context.keys.cloudRole] = 'Web backend';
      applicationInsights.start();
    }

    this.soundsService = new SoundsService(environment.dbConnectionString, environment.blobStorageConnectionString);
    this.prefsService = new PrefsService(environment.dbConnectionString);
    this.favoritesService = new FavoritesService(environment.dbConnectionString);
    this.tagsService = new TagsService(environment.dbConnectionString);

    this.authURL = `https://discord.com/api/oauth2/authorize?client_id=${ environment.clientID }&redirect_uri=${ encodeURI(environment.webServerUrl) }&response_type=code&scope=identify&prompt=none`;
  }

  private onSoundRequest(userId: string, soundId: string) {
    this.soundSubscribers.forEach(x => x(userId, soundId));
  }

  private onSkipRequest(userId: string, skipAll: boolean) {
    this.skipSubscribers.forEach(x => x(userId, skipAll));
  }

  subscribeToSoundRequests(subscriber: SoundRequestSubscriber) {
    this.soundSubscribers.push(subscriber);
  }

  subscribeToSkipRequests(subscriber: SkipRequestSubscriber) {
    this.skipSubscribers.push(subscriber);
  }

  start() {
    const app = express();
    app.use(requestLogger);
    const serveStatic = express.static('src/public', { extensions: ['html'] });

    app.use(cookieParser());
    app.use(cors({ origin: this.environment.webServerUrl }));
    app.use(express.json());

    app.post('/logout', (req, res) => {
      res.clearCookie('accesstoken');
      res.clearCookie('refreshtoken');
      res.sendStatus(201);
      res.end();
    });

    app.use(DiscordAuth(this.environment, this.prefsService, this.authURL));
    app.use(async (req, res, next) => {
      const sortPrefs = await this.prefsService.getSortPrefs(String(req.cookies.userid));
      res.cookie('sortpref', sortPrefs.sortOrder);
      res.cookie('groupspref', sortPrefs.tagGroups);
      next();
    });

    app.use('/api/sounds', soundsRouter(this.soundsService, this.favoritesService, this.tagsService, this.environment.frontendSoundsBaseUrl));
    app.use('/api/prefs', prefsRouter(this.prefsService));
    app.use('/api/favorites', favoritesRouter(this.favoritesService));
    app.use('/api/tags', tagsRouter(this.tagsService));
    app.use('/api/queue', queueRouter((userId: string, soundId: string) => this.onSoundRequest(userId, soundId), (userId: string, skipAll: boolean) => this.onSkipRequest(userId, skipAll)));

    if (this.environment.environment === 'production') app.use(serveStatic);
    else app.use('/', createProxyMiddleware({ target: 'http://frontend:3000', changeOrigin: true }));

    return app.listen(this.environment.port, () => {
      logger.info(`web server listening on port ${ this.environment.port }`);
    });
  }
}
