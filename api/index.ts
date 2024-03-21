import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import cors from './src/middleware/cors';

import session from './src/middleware/session';
import apiRouter from './src/routes';
import { errorHandler } from './src/middleware/errorHandler';

const app: Application = express();

// middleware
app.use(cors);
app.use(express.json());
app.use(helmet());
app.set('trust proxy', 1);

app.use(session);

// routes
app.use(apiRouter);

// error handling
app.use(errorHandler);

const port = process.env.PORT || 8000;
app.listen(Number(port), '0.0.0.0', () => {
  console.log(`Server is listening on port ${port}`);
});
