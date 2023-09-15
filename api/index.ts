import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response, Application } from 'express';

import activitiesRouter from './src/activity/activity.router';

const app: Application = express();

// middleware
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Time Tracker app2');
});

app.use('/api/v1/activities', activitiesRouter);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
