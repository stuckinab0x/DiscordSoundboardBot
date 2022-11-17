import * as applicationInsights from 'applicationinsights';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import axios, { AxiosRequestConfig } from 'axios';
import multer from 'multer';
import { SoundsService, AddSoundOptions, errors as soundErrors } from 'botman-sounds';
import { FavoritesService } from 'botman-users';
import { createProxyMiddleware } from 'http-proxy-middleware';
import DiscordAuth from './discord-auth';
import environment from './environment';

if (environment.environment === 'production') {
  applicationInsights.setup();
  applicationInsights.defaultClient.context.tags[applicationInsights.defaultClient.context.keys.cloudRole] = 'Web backend';
  applicationInsights.start();
}

const soundsService = new SoundsService(environment.dbConnectionString, environment.blobStorageConnectionString);
const favoritesService = new FavoritesService(environment.dbConnectionString);

const app = express();
const serveStatic = express.static('src/public', { extensions: ['html'] });

app.use(cookieParser());
app.use(cors({ origin: environment.webServerURL }));
app.use(express.text());
const upload = multer();

app.post('/logout', (req, res) => {
  res.clearCookie('accesstoken');
  res.clearCookie('refreshtoken');
  res.sendStatus(201);
  res.end();
});

app.use(DiscordAuth);

app.get('/api/sounds', async (req, res) => {
  const sounds = await soundsService.getAllSounds();
  const favorites = await favoritesService.getFavorites(req.cookies.userid);
  res.send(sounds.map(x => ({ id: x.id, name: x.name, isFavorite: favorites.indexOf(x.id) !== -1 })));
});

app.put('/api/favorites/:id', async (req, res) => {
  await favoritesService.addToFavorites({ userId: String(req.cookies.userid), soundId: req.params.id });
  res.sendStatus(204);
  res.end();
});

app.delete('/api/favorites/:id', async (req, res) => {
  await favoritesService.removeFromFavorites({ userId: String(req.cookies.userid), soundId: req.params.id });
  res.sendStatus(204);
  res.end();
});

const botConfig: AxiosRequestConfig = { headers: { Authorization: environment.botApiKey } };

app.post('/api/sound', (req, res) => {
  console.log('Sound request.');
  const body = { userID: req.cookies.userid, sound: req.body };
  axios.post(`${ environment.botURL }/soundrequest`, body, botConfig)
    .catch(error => console.log(error));
  res.end();
});

app.post('/api/skip', async (req, res) => {
  console.log(`Skip request. All: ${ req.query.skipAll }`);
  const skipAll = !!req.query?.skipAll;

  await axios.post(`${ environment.botURL }/skip`, { skipAll, userID: req.cookies.userid }, botConfig);

  res.sendStatus(204);
  res.end();
});

app.post('/api/addsound', upload.single('sound-file'), async (req, res) => {
  console.log('Addsound request.');
  const name = req.body['custom-name'];

  if (!name) {
    res.sendStatus(400);
    res.end();
    return;
  }

  const newSound: AddSoundOptions = {
    name,
    file: req.file.buffer,
  };

  try {
    await soundsService.addSound(newSound);
  } catch (error) {
    if (error.message === soundErrors.soundAlreadyExists) {
      console.log(error);
      res.sendStatus(409);
      res.end();
      return;
    }

    if (error.message === soundErrors.unsupportedFileExtension) {
      console.log(error);
      res.sendStatus(400);
      res.end();
      return;
    }

    throw error;
  }

  res.sendStatus(204);
  res.end();
});

app.get('/api/preview', async (req, res) => {
  const sound = await soundsService.getSound(String(req.query.soundName));

  if (!sound) {
    res.sendStatus(404).end();
    return;
  }

  res.send(`${ environment.soundsBaseUrl }/${ sound.file.fullName }`);
});

if (environment.environment === 'production') app.use(serveStatic);
else app.use('/', createProxyMiddleware({ target: 'http://frontend:3000', changeOrigin: true }));

app.listen(environment.port, () => {
  console.log(`web server listening on port ${ environment.port }`);
});
