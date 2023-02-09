import { Router } from 'express';
import { TagsService } from 'botman-users';

function customTagsRouter(tagsService: TagsService) {
  const router = Router();

  router.get('/', async (req, res) => {
    const tags = await tagsService.getCustomTags(String(req.cookies.userid));
    res.send(tags);
  });

  router.post('/:name/:color', async (req, res) => {
    await tagsService.addNewTag({ userId: String(req.cookies.userid), tagName: req.params.name, tagColor: req.params.color });
    res.sendStatus(204);
    res.end();
  });

  router.put('/:id/:name/:color', async (req, res) => {
    await tagsService.editTagProps({ tagId: req.params.id, userId: String(req.cookies.userid), tagName: req.params.name, tagColor: req.params.color });
    res.sendStatus(204);
    res.end();
  });

  router.delete('/:id', async (req, res) => {
    await tagsService.deleteTag({ tagId: req.params.id, userId: String(req.cookies.userid) });
    res.sendStatus(204);
    res.end();
  });

  router.put('/editsounds', async (req, res) => {
    if (req.body.deleted.length) await tagsService.removeSoundsFromTags({ deleted: req.body.deleted, userId: String(req.cookies.userid) });
    if (req.body.added.length) await tagsService.addSoundsToTag({ tagId: req.body.addedId, userId: String(req.cookies.userid), added: req.body.added });
    res.sendStatus(204);
    res.end();
  });

  return router;
}

export default customTagsRouter;
