import { Router } from 'express';

import user from './routes/user';

// guaranteed to get dependencies
export default () => {
  const router = Router();
  user(router);

  return router;
};
