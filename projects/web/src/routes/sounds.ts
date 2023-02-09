import { Router, RequestHandler } from 'express';
import axios, { RawAxiosRequestConfig } from 'axios';
import { SoundsService, errors, AddSoundOptions } from 'botman-sounds';
import { FavoritesService } from 'botman-users';
import multer from 'multer';
import environment from '../environment';

const isAdmin: RequestHandler = (req, res, next) => {
  if (req.userRole === 'admin')
    return next();
  return res.sendStatus(403);
};

function soundsRouter(soundsService: SoundsService, favoritesService: FavoritesService) {
  const botConfig: RawAxiosRequestConfig = { headers: { Authorization: environment.botApiKey } };
  const router = Router();
  const upload = multer();

  router.get('/', async (req, res) => {
    const sounds = await soundsService.getAllSounds();
    const favorites = await favoritesService.getFavorites(req.cookies.userid);
    res.send(sounds.map(x => ({ id: x.id, name: x.name, date: x.createdAt, isFavorite: favorites.indexOf(x.id) !== -1 })));
  });

  router.get('/:soundid', (req, res) => {
    console.log('Sound request.');
    axios.post(`${ environment.botURL }/soundrequest/${ req.cookies.userid }/${ req.params.soundid }`, null, botConfig)
      .catch(error => console.log(error));
    res.end();
  });

  router.delete('/:soundname', isAdmin, async (req, res) => {
    await soundsService.deleteSound(req.params.soundname);
    res.sendStatus(200);
  });

  router.put('/:oldname/:newname', isAdmin, async (req, res) => {
    await soundsService.renameSound({ oldName: req.params.oldname, newName: req.params.newname });
    res.sendStatus(200);
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

  return router;
}

export default soundsRouter;
