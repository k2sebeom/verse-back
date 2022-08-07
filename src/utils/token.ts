import * as jwt from 'jsonwebtoken';
import { Credentials, TokenInterface } from '../@types/Auth';
import config from '../config';

export function validateToken(jwtToken: string, id: number): boolean {
  const token = jwtToken.replace('Bearer ', '');
  try {
    const info = jwt.verify(token, config.jwtSecret) as TokenInterface;
    if (id !== info.id) {
      return false;
    }
  } catch {
    return false;
  }
  return true;
}

export function verifyToken(jwtToken: string): number | null {
  const token = jwtToken.replace('Bearer ', '');
  try {
    const info = jwt.verify(token, config.jwtSecret) as TokenInterface;
    return info.id;
  } catch {
    return null;
  }
  return null;
}

export function getCredentials(id: number): Credentials {
  const refreshToken = jwt.sign({ id }, config.jwtSecret, {
    expiresIn: '14d',
    issuer: 'cotak',
  });

  const accessToken = jwt.sign({ id }, config.jwtSecret, {
    expiresIn: '1d',
    issuer: 'cotak',
  });

  return { accessToken, refreshToken };
}
