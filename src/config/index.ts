import 'dotenv/config';

export default {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,

  api: {
    prefix: '/api',
  },
};
