import { Router } from 'express';

function queueRouter(
  onSoundRequest: (userId: string, soundId: string) => Promise<boolean>,
  onSkipRequest: (userId: string, skipAll: boolean) => void,
) {
  const router = Router();

  router.post('/:id', async (req, res) => {
    const result = await onSoundRequest(req.cookies.userid, req.params.id);
    res.sendStatus(result ? 204 : 418);
  });

  router.delete('/:all', async (req, res) => {
    onSkipRequest(req.cookies.userid, !!req.params.all);
    res.sendStatus(204);
  });

  return router;
}

export default queueRouter;
