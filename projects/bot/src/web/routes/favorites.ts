import { Router } from 'express';
import { FavoritesService } from 'botman-users';

function favoritesRouter(favoritesService: FavoritesService) {
  const router = Router();

  router.post('/', async (req, res) => {
    await favoritesService.addToFavorites({ userId: String(req.cookies.userid), soundId: req.body.soundId });
    res.sendStatus(204);
    res.end();
  });

  router.delete('/', async (req, res) => {
    await favoritesService.removeFromFavorites({ userId: String(req.cookies.userid), soundId: req.body.soundId });
    res.sendStatus(204);
    res.end();
  });

  return router;
}

export default favoritesRouter;
