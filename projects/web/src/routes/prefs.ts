import { Router } from 'express';
import { PrefsService } from 'botman-users';

function prefsRouter(prefsService: PrefsService) {
  const router = Router();

  router.put('/setsortorder/:pref', async (req, res) => {
    await prefsService.setSortOrderPref(String(req.cookies.userid), req.params.pref);
    res.sendStatus(204);
  });

  router.put('/setgroups/:pref', async (req, res) => {
    await prefsService.setGroupsPref(String(req.cookies.userid), req.params.pref);
    res.sendStatus(204);
  });

  return router;
}

export default prefsRouter;
