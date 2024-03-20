import RedisStore from 'connect-redis';
import session from 'express-session';
import { createClient } from 'redis';

// Session object
declare module 'express-session' {
  interface SessionData {
    user: { id: bigint; email: string };
  }
}

// Initialize client
let redisClient = createClient({ url: process.env.REDIS_URL });
redisClient
  .on('connect', () => console.log('redis connected'))
  .on('error', (error) => console.log('redis error', error));

redisClient.connect().catch(console.error);

// Initialize store
let redisStore = new RedisStore({
  client: redisClient,
});

const env = process.env.NODE_ENV || 'development';

// Define session
export default session({
  store: redisStore,
  secret: process.env.EXPRESS_SESSION_SECRET as string,
  saveUninitialized: false,
  resave: false,
  name: 'sessionId',
  cookie: {
    secure: env === 'production' ? true : false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
});
