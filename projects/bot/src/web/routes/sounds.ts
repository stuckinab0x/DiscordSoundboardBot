import { Router } from 'express';
import { SoundsService, errors, AddSoundOptions } from 'botman-sounds';
import { FavoritesService, TagsService } from 'botman-users';
import multer from 'multer';
import logger from '../../logger';
import isAdmin from '../middlewares/is-admin';

function soundsRouter(soundsService: SoundsService, favoritesService: FavoritesService, tagsService: TagsService, soundsBaseUrl: string) {
  const router = Router();
  const upload = multer();

  router.get('/', async (req, res) => {
    const sounds = await soundsService.getAllSounds();
    const favorites = await favoritesService.getFavorites(req.cookies.userid);
    res.send(sounds.map(x => ({
      id: x.id,
      name: x.name,
      date: x.createdAt,
      url: `${ soundsBaseUrl }/${ x.file.fullName }`,
      isFavorite: favorites.indexOf(x.id) !== -1,
      volume: x.volume,
    })));
  });

  router.post('/', upload.single('sound-file'), async (req, res) => {
    logger.info('Addsound request.');
    const name = req.body['custom-name'];

    if (!name) {
      res.sendStatus(400);
      res.end();
      return;
    }

    try {
      if (req.file) {
        const newSound: AddSoundOptions = {
          name,
          file: req.file?.buffer,
        };
        await soundsService.addSound(newSound);
      }
    } catch (error: any) {
      if (error.message === errors.soundAlreadyExists) {
        logger.info(error);
        res.sendStatus(409);
        res.end();
        return;
      }

      if (error.message === errors.unsupportedFileExtension) {
        logger.info(error);
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

  return router;
}

export default soundsRouter;
