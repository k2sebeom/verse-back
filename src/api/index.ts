import { Router } from 'express';

import auth from './routes/auth';

// guaranteed to get dependencies
export default () => {
  const router = Router();
  auth(router);

  return router;
};
