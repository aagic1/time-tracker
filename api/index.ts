import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import cors from 'cors';

import session from './src/middleware/session';
import apiRouter from './src/routes';
import { errorHandler } from './src/middleware/errorHandler';

const app: Application = express();

let origin = process.env.CORS_ORIGIN!;
if (origin.slice(-1) === '/') {
  origin = origin.slice(0, -1);
}
// middleware
app.use(
  cors({
    credentials: true,
    origin: origin,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(helmet());
app.set('trust proxy', 1);

app.use(session);

// routes
app.use('/api/v1', apiRouter);

// error handling
app.use(errorHandler);

const port = process.env.PORT || 8000;
app.listen(Number(port), '0.0.0.0', () => {
  console.log(`Server is listening on port ${port}`);
});
