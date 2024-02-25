import RedisStore from 'connect-redis';
import session from 'express-session';
import { createClient } from 'redis';

// ession object
declare module 'express-session' {
  interface SessionData {
    user: { id: bigint; email: string };
  }
}

// Initialize client
let redisClient = createClient({ url: 'redis://127.0.0.1:6379' });
redisClient.connect().catch(console.error);

// Initialize store
let redisStore = new RedisStore({
  client: redisClient,
});

// Define session
export default session({
  store: redisStore,
  secret: process.env.EXPRESS_SESSION_SECRET as string,
  saveUninitialized: false,
  resave: false,
  name: 'sessionId',
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
});
