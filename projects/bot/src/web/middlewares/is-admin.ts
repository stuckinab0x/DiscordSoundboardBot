import { RequestHandler } from 'express';

const isAdmin: RequestHandler = (req, res, next) => {
  if (req.userRole === 'admin')
    next();
  else
    res.sendStatus(403);
};

export default isAdmin;
