import { RequestHandler } from 'express';

const isAdmin: RequestHandler = (req, res, next) => {
  if (req.userRole === 'admin')
    return next();
  return res.sendStatus(403);
};

export default isAdmin;
