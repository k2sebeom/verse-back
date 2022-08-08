import 'dotenv/config';

export default {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,

  muxTokenId: process.env.MUX_TOKEN_ID,
  muxTokenSecret: process.env.MUX_TOKEN_SECRET,
  api: {
    prefix: '/api',
  },
};
