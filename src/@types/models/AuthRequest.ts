import { Request } from 'express';

interface RegisterRequest extends Request {
  body: {
    museId: number,
    museAlias: string
  }
}

export type { RegisterRequest };
