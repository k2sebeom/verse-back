import { Router } from 'express';

import auth from './routes/auth';
import user from './routes/user';

// guaranteed to get dependencies
export default () => {
  const router = Router();
  auth(router);
  user(router);

  return router;
};
