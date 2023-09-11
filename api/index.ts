import express, { Express, Request, Response, Application } from 'express';
import dotenv from 'dotenv';

import activitiesRouter from './src/routes/activities';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.get('/', (req: Request, res: Response) => {
  res.send('Time Tracker app2');
});

app.use('/api/v1/activities', activitiesRouter);

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:{port}`);
});
