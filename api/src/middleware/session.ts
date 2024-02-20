import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    user: { id: bigint; email: string };
  }
}

export default session({
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
