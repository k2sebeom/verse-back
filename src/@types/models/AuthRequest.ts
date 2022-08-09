import { Request } from 'express';

interface RegisterRequest extends Request {
  body: {
    museId: number
  }
}

export type { RegisterRequest };
