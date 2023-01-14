import { Router } from 'express';
import { FavoritesService } from 'botman-users';

function favoritesRouter(favoritesService: FavoritesService) {
  const router = Router();

  router.put('/:id', async (req, res) => {
    await favoritesService.addToFavorites({ userId: String(req.cookies.userid), soundId: req.params.id });
    res.sendStatus(204);
    res.end();
  });

  router.delete('/:id', async (req, res) => {
    await favoritesService.removeFromFavorites({ userId: String(req.cookies.userid), soundId: req.params.id });
    res.sendStatus(204);
    res.end();
  });

  return router;
}

export default favoritesRouter;
