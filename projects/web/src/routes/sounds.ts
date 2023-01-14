import { Router } from 'express';
import axios, { AxiosRequestConfig } from 'axios';
import { SoundsService, errors, AddSoundOptions } from 'botman-sounds';
import { FavoritesService } from 'botman-users';
import multer from 'multer';
import environment from '../environment';

function soundsRouter(soundsService: SoundsService, favoritesService: FavoritesService) {
  const botConfig: AxiosRequestConfig = { headers: { Authorization: environment.botApiKey } };
  const router = Router();
  const upload = multer();

  router.get('/sounds', async (req, res) => {
    const sounds = await soundsService.getAllSounds();
    const favorites = await favoritesService.getFavorites(req.cookies.userid);
    res.send(sounds.map(x => ({ id: x.id, name: x.name, date: x.createdAt, isFavorite: favorites.indexOf(x.id) !== -1 })));
  });

  router.post('/sound', (req, res) => {
    console.log('Sound request.');
    const body = { userID: req.cookies.userid, sound: req.body };
    axios.post(`${ environment.botURL }/soundrequest`, body, botConfig)
      .catch(error => console.log(error));
    res.end();
  });

  router.post('/skip', async (req, res) => {
    console.log(`Skip request. All: ${ req.query.skipAll }`);
    const skipAll = !!req.query?.skipAll;

    await axios.post(`${ environment.botURL }/skip`, { skipAll, userID: req.cookies.userid }, botConfig);

    res.sendStatus(204);
    res.end();
  });

  router.get('/preview', async (req, res) => {
    const sound = await soundsService.getSound(String(req.query.soundName));

    if (!sound) {
      res.sendStatus(404).end();
      return;
    }

    res.send(`${ environment.soundsBaseUrl }/${ sound.file.fullName }`);
  });

  router.post('/addsound', upload.single('sound-file'), async (req, res) => {
    console.log('Addsound request.');
    const name = req.body['custom-name'];

    if (!name) {
      res.sendStatus(400);
      res.end();
      return;
    }

    const newSound: AddSoundOptions = {
      name,
      file: req.file?.buffer,
    };

    try {
      await soundsService.addSound(newSound);
    } catch (error) {
      if (error.message === errors.soundAlreadyExists) {
        console.log(error);
        res.sendStatus(409);
        res.end();
        return;
      }

      if (error.message === errors.unsupportedFileExtension) {
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

  return router;
}

export default soundsRouter;
