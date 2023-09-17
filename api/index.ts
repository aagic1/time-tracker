import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response, Application } from 'express';
import 'express-async-errors';
import helmet from 'helmet';

import session from './src/middleware/session';
import apiRouter from './src/routes';
import { errorHandler } from './src/middleware/errorHandler';

const app: Application = express();

// middleware
app.use(express.json());
app.use(session);
app.use(helmet());

app.get('/', (req: Request, res: Response) => {
  res.send('Time Tracker app2');
});

declare module 'express-session' {
  interface SessionData {
    user: { id: bigint };
  }
}

// routes
app.use('/api/v1', apiRouter);

// error handling
app.use(errorHandler);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
