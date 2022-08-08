import { Request } from 'express';

interface SignUpRequest extends Request {
  body: {
    email: string;
    password: string;
    nickname: string;
    isMusician: boolean;
  };
}

interface SignInRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

interface RefreshRequest extends Request {
  body: {
    email: string;
    password: string;
    refreshToken: string;
  };
}

export type { SignUpRequest, SignInRequest, RefreshRequest };
