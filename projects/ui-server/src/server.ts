import * as applicationInsights from 'applicationinsights';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import axios, { AxiosRequestConfig } from 'axios';
import multer from 'multer';
import streamifier from 'streamifier';
import sanitize from 'sanitize-filename';
import { SoundsService, AddSoundOptions, errors as soundErrors } from 'botman-sounds';
import fs from 'node:fs';
import DiscordAuth from './discord-auth';
import environment from './environment';

if (environment.environment === 'production') {
  applicationInsights.setup();
  applicationInsights.defaultClient.context.tags[applicationInsights.defaultClient.context.keys.cloudRole] = 'Web backend';
  applicationInsights.start();
}

const soundsService = new SoundsService(environment.soundsConnectionString, environment.soundsDirectory);

const app = express();
const serveStatic = express.static('src/public', { extensions: ['html'] });

app.use(cookieParser());
app.use(cors({ origin: environment.UIServerURL }));
app.use(express.text());
const upload = multer();

app.get('/logout', (req, res, next) => {
  res.clearCookie('accesstoken');
  res.clearCookie('refreshtoken');
  next();
}, serveStatic);

app.use(DiscordAuth);

app.get('/api/soundlist', async (req, res) => {
  try {
    const soundRes = await soundsService.getAllSounds();
    res.send(soundRes.map(x => x.name));
  } catch (error) {
    console.log(error);
  }
});

const botConfig: AxiosRequestConfig = { headers: { Authorization: environment.botApiKey } };

app.post('/api/sound', (req, res) => {
  console.log('Sound request.');
  const body = { userID: req.cookies.userid, sound: req.body };
  axios.post(`${ environment.botURL }/soundrequest`, body, botConfig)
    .catch(error => console.log(error));
  res.end();
});

app.get('/api/skip', (req, res) => {
  console.log(`Skip request. All: ${ req.query.skipAll }`);
  const skipAll = !!req.query?.skipAll;
  axios.post(`${ environment.botURL }/skip`, { skipAll, userID: req.cookies.userid }, botConfig)
    .catch(error => console.log(error));
  res.end();
});

const validContentTypes = ['audio/wav', 'audio/mpeg', 'audio/webm', 'audio/ogg'];
const extensions = ['.wav', '.mp3', '.webm', '.ogg'];
app.post('/api/addsound', upload.single('sound-file'), async (req, res) => {
  console.log('Addsound request.');
  if (!validContentTypes.includes(req.file.mimetype) || !req.body['custom-name']) {
    res.sendStatus(400);
    res.end();
    return;
  }
  const newSound: AddSoundOptions = {
    name: req.body['custom-name'],
    fileName: sanitize(req.body['custom-name']) + extensions[validContentTypes.indexOf(req.file.mimetype)],
    fileStream: streamifier.createReadStream(req.file.buffer),
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
    throw error;
  }
  res.sendStatus(204);
  res.end();
});

app.get('/api/preview', async (req, res) => {
  const sound = await soundsService.getSound(String(req.query.soundName));
  const readStream = fs.createReadStream(`${ environment.soundsDirectory }/${ sound.file.fullName }`);
  readStream.on('open', () => readStream.pipe(res));
  readStream.on('close', () => res.end());
});

app.use(serveStatic);

app.listen(environment.port, () => {
  console.log(`ui-server listening on port ${ environment.port }`);
});
