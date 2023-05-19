import { Router } from 'express';
import axios, { RawAxiosRequestConfig } from 'axios';
import { SoundsService, errors, AddSoundOptions } from 'botman-sounds';
import { FavoritesService, TagsService } from 'botman-users';
import multer from 'multer';
import isAdmin from '../middlewares/is-admin';
import environment from '../environment';

function soundsRouter(soundsService: SoundsService, favoritesService: FavoritesService, tagsService: TagsService) {
  const botConfig: RawAxiosRequestConfig = { headers: { Authorization: environment.botApiKey } };
  const router = Router();
  const upload = multer();

  router.get('/', async (req, res) => {
    const sounds = await soundsService.getAllSounds();
    const favorites = await favoritesService.getFavorites(req.cookies.userid);
    res.send(sounds.map(x => ({
      id: x.id,
      name: x.name,
      date: x.createdAt,
      url: `${ environment.soundsBaseUrl }/${ x.file.fullName }`,
      isFavorite: favorites.indexOf(x.id) !== -1,
      volume: x.volume,
    })));
  });

  router.post('/', upload.single('sound-file'), async (req, res) => {
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

  router.put('/:id', isAdmin, async (req, res) => {
    if (!req.body.name)
      await soundsService.updateSoundVolume({ id: req.params.id, volume: req.body.volume });
    else
      await soundsService.renameSound({ id: req.params.id, name: req.body.name });
    res.sendStatus(204);
  });

  router.delete('/:id', isAdmin, async (req, res) => {
    await soundsService.deleteSound(req.params.id);
    await tagsService.removeDeletedSound(req.params.id);
    res.sendStatus(204);
  });

  router.get('/:id', (req, res) => {
    console.log('Sound request.');
    axios.post(`${ environment.botURL }/soundrequest/${ req.cookies.userid }/${ req.params.id }`, null, botConfig)
      .catch(error => console.log(error));
    res.end();
  });

  return router;
}

export default soundsRouter;
