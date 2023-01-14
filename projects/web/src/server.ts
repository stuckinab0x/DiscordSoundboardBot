import * as applicationInsights from 'applicationinsights';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { SoundsService } from 'botman-sounds';
import { PrefsService, FavoritesService, TagsService } from 'botman-users';
import { createProxyMiddleware } from 'http-proxy-middleware';
import DiscordAuth from './discord-auth';
import soundsRouter from './routes/sounds';
import favoritesRouter from './routes/favorites';
import customTagsRouter from './routes/custom-tags';
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
app.use(express.text());
app.use(express.json());

app.post('/logout', (req, res) => {
  res.clearCookie('accesstoken');
  res.clearCookie('refreshtoken');
  res.sendStatus(201);
  res.end();
});

app.use(DiscordAuth);
app.use(async (req, res, next) => {
  const sortRule = await prefsService.getSortOrderPref(String(req.cookies.userid));
  const groupRule = await prefsService.getGroupsPref(String(req.cookies.userid));
  res.cookie('sortpref', sortRule);
  res.cookie('groupspref', groupRule);
  next();
});

app.use('/api', soundsRouter(soundsService, favoritesService));
app.use('/api/prefs', prefsRouter(prefsService));
app.use('/api/favorites', favoritesRouter(favoritesService));
app.use('/api/customtags', customTagsRouter(tagsService));

if (environment.environment === 'production') app.use(serveStatic);
else app.use('/', createProxyMiddleware({ target: 'http://frontend:3000', changeOrigin: true }));

app.listen(environment.port, () => {
  console.log(`web server listening on port ${ environment.port }`);
});
