import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response, Application } from 'express';

import session from './src/middleware/session';
import apiRouter from './src/routes';

const app: Application = express();

// middleware
app.use(express.json());
app.use(session);

app.get('/', (req: Request, res: Response) => {
  res.send('Time Tracker app2');
});

declare module 'express-session' {
  interface SessionData {
    user: { id: number };
  }
}

// routes
app.use('/api/v1', apiRouter);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
