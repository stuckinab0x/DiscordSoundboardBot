import * as applicationInsights from 'applicationinsights';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import axios, { RawAxiosRequestConfig } from 'axios';
import { SoundsService } from 'botman-sounds';
import { PrefsService, FavoritesService, TagsService } from 'botman-users';
import { createProxyMiddleware } from 'http-proxy-middleware';
import DiscordAuth from './middlewares/discord-auth';
import soundsRouter from './routes/sounds';
import favoritesRouter from './routes/favorites';
import tagsRouter from './routes/tags';
import prefsRouter from './routes/prefs';
import environment from './environment';

if (environment.environment === 'production') {
  applicationInsights.setup();
  applicationInsights.defaultClient.context.tags[applicationInsights.defaultClient.context.keys.cloudRole] = 'Web backend';
  applicationInsights.start();
}

const soundsService = new SoundsService(environment.dbConnectionString, environment.blobStorageConnectionString);
const prefsService = new PrefsService(environment.dbConnectionString);
const favoritesService = new FavoritesService(environment.dbConnectionString);
const tagsService = new TagsService(environment.dbConnectionString);

const app = express();
const serveStatic = express.static('src/public', { extensions: ['html'] });

app.use(cookieParser());
app.use(cors({ origin: environment.webServerURL }));
app.use(express.json());

app.post('/logout', (req, res) => {
  res.clearCookie('accesstoken');
  res.clearCookie('refreshtoken');
  res.sendStatus(201);
  res.end();
});

app.use(DiscordAuth(prefsService));
app.use(async (req, res, next) => {
  const sortPrefs = await prefsService.getSortPrefs(String(req.cookies.userid));
  res.cookie('sortpref', sortPrefs.sortOrder);
  res.cookie('groupspref', sortPrefs.tagGroups);
  next();
});

app.use('/api/sounds', soundsRouter(soundsService, favoritesService, tagsService));
app.use('/api/prefs', prefsRouter(prefsService));
app.use('/api/favorites', favoritesRouter(favoritesService));
app.use('/api/tags', tagsRouter(tagsService));

const botConfig: RawAxiosRequestConfig = { headers: { Authorization: environment.botApiKey } };
app.get('/api/skip/:all', async (req, res) => {
  console.log(`Skip request. All: ${ req.params.all }`);
  const skipAll = !!req.params.all;

  await axios.post(`${ environment.botURL }/skip/${ skipAll }/${ req.cookies.userid }`, null, botConfig);

  res.sendStatus(204);
  res.end();
});

if (environment.environment === 'production') app.use(serveStatic);
else app.use('/', createProxyMiddleware({ target: 'http://frontend:3000', changeOrigin: true }));

app.listen(environment.port, () => {
  console.log(`web server listening on port ${ environment.port }`);
});
