import { Service } from 'typedi';
import db from '../utils/db';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { getCredentials, validateToken } from '../utils/token';
import { Credentials } from '../@types/Auth';

@Service()
export default class UserService {
  public getUser = async (email: string): Promise<User | null> => {
    const user = await db.user.findUnique({
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
  ): Promise<User> => {
    const pwHash = await bcrypt.hash(password, 12);

    return await db.user.create({
      data: {
        email,
        pw: pwHash,
      },
    });
  };

  public updateUserRefreshToken = async (id: number): Promise<Credentials> => {
    const cred = getCredentials(id);

    await db.user.update({
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
    const user = await db.user.findUnique({
      where: { id },
    });
    const token = refreshToken.replace('Bearer ', '');
    return user.refreshToken === token && validateToken(refreshToken, id);
  };
}
