import { Service } from 'typedi';
import db from '../utils/db';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { getCredentials, validateToken } from '../utils/token';
import { Credentials } from '../@types/Auth';
import Mux from '@mux/mux-node';
import config from '../config';


@Service()
export default class UserService {
  public muxClient: Mux;

  constructor() {
    this.muxClient = new Mux(config.muxTokenId, config.muxTokenSecret);
  }

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

  public getUserById = async (id: number): Promise<User | null> => {
    const user = await db.user.findUnique({
      where: { id },
    });
    if (user) {
      return user;
    } else {
      return null;
    }
  };

  public createUser = async (
    email: string,
    password: string,
    nickname: string,
    isMusician: boolean
  ): Promise<User> => {
    const pwHash = await bcrypt.hash(password, 12);

    let streamKey = '';
    let liveUrl = '';

    if(isMusician) {
      const stream = await this.muxClient.Video.LiveStreams.create({
        playback_policy: 'public',
        new_asset_settings: {
          playback_policy: 'public'
        },
        embedded_subtitles: [],
        latency_mode: 'low'
      });

      streamKey = stream.stream_key;
      liveUrl = `https://stream.mux.com/${stream.playback_ids[0].id}.m3u8`;
    }

    return await db.user.create({
      data: {
        email,
        pw: pwHash,
        nickname,
        role: isMusician ? 'MUSICIAN' : 'AUDIENCE',
        streamKey, liveUrl
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
