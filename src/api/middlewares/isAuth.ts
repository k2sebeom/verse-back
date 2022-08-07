import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../../utils/token';

const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(400).send({ msg: 'Token Missing' });
    return;
  }

  const userId = verifyToken(authorization);

  if (!userId) {
    res.status(401).send({ msg: 'Token Invalid' });
    return;
  }

  req.headers['user-id'] = userId.toString();
  next();
};

export default isAuth;
