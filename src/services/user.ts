import { Service } from 'typedi';
import db from '../utils/db';
import { User } from '@prisma/client';
import Mux from '@mux/mux-node';
import config from '../config';


@Service()
export default class UserService {
  public muxClient: Mux;

  constructor() {
    this.muxClient = new Mux(config.muxTokenId, config.muxTokenSecret);
  }

  public getUserByMuse = async (museId: number): Promise<User | null> => {
    const user = await db.user.findUnique({
      where: { museId },
    });
    if (user) {
      return user;
    } else {
      return null;
    }
  }

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

  public register = async (museId: number): Promise<User> => {
    const stream = await this.muxClient.Video.LiveStreams.create({
      playback_policy: 'public',
      new_asset_settings: {
        playback_policy: 'public'
      },
      embedded_subtitles: [],
      latency_mode: 'low'
    });

    const streamKey = stream.stream_key;
    const liveUrl = `https://stream.mux.com/${stream.playback_ids[0].id}.m3u8`;

    return await db.user.create({
      data: {
        museId,
        streamKey, liveUrl
      },
    });
  }
}
