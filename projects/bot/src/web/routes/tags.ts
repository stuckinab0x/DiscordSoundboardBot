import { Router } from 'express';
import { TagsService } from 'botman-users';
import logger from '../../logger';

function tagsRouter(tagsService: TagsService) {
  const router = Router();

  router.get('/', async (req, res) => {
    const tags = await tagsService.getCustomTags(String(req.cookies.userid));
    res.send(tags);
  });

  router.post('/', async (req, res) => {
    logger.info(JSON.stringify(req.body));
    await tagsService.addNewTag({ userId: String(req.cookies.userid), tagName: req.body.name, tagColor: req.body.color });
    res.sendStatus(204);
    res.end();
  });

  router.put('/:id', async (req, res) => {
    await tagsService.editTagProps({ tagId: req.params.id, userId: String(req.cookies.userid), tagName: req.body.name, tagColor: req.body.color });
    res.sendStatus(204);
    res.end();
  });

  router.delete('/:id', async (req, res) => {
    await tagsService.deleteTag({ tagId: req.params.id, userId: String(req.cookies.userid) });
    res.sendStatus(204);
    res.end();
  });

  router.put('/:id/sounds', async (req, res) => {
    if (req.body.deleted.length) await tagsService.removeSoundsFromTags({ deleted: req.body.deleted, userId: String(req.cookies.userid) });
    if (req.body.added.length) await tagsService.addSoundsToTag({ tagId: req.params.id, userId: String(req.cookies.userid), added: req.body.added });
    res.sendStatus(204);
    res.end();
  });

  return router;
}

export default tagsRouter;
