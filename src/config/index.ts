import 'dotenv/config';

export default {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,

  muxTokenId: process.env.MUX_TOKEN_ID,
  muxTokenSecret: process.env.MUX_TOKEN_SECRET,

  agoraId: process.env.AGORA_APP_ID,
  agoraCert: process.env.AGORA_APP_CERT,
  api: {
    prefix: '/api',
  },
};
