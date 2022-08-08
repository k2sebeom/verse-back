import { Service } from 'typedi';
import db from '../utils/db';
import * as bcrypt from 'bcrypt';
import { Auth } from '@prisma/client';
import { getCredentials, validateToken } from '../utils/token';
import { Credentials } from '../@types/Auth';

@Service()
export default class UserService {
  public getUser = async (email: string): Promise<Auth | null> => {
    const user = await db.auth.findUnique({
      where: { email },
    });
    if (user) {
      return user;
    } else {
      return null;
    }
  };

  public createUser = async (
    email: string,
    password: string
  ): Promise<Auth> => {
    const pwHash = await bcrypt.hash(password, 12);

    return await db.auth.create({
      data: {
        email,
        pw: pwHash,
      },
    });
  };

  public updateUserRefreshToken = async (id: number): Promise<Credentials> => {
    const cred = getCredentials(id);

    await db.auth.update({
      where: { id },
      data: {
        refreshToken: cred.refreshToken,
      },
    });

    return cred;
  };

  public isPasswordValid = async (
    pw: string,
    pwHash: string
  ): Promise<boolean> => {
    return await bcrypt.compare(pw, pwHash);
  };

  public isRefreshTokenValid = async (
    refreshToken: string,
    id: number
  ): Promise<boolean> => {
    const user = await db.auth.findUnique({
      where: { id },
    });
    const token = refreshToken.replace('Bearer ', '');
    return user.refreshToken === token && validateToken(refreshToken, id);
  };
}
