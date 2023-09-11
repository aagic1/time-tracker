import express, { Express, Request, Response, Application } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.get('/', (req: Request, res: Response) => {
  res.send('Time Tracker app2');
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:{port}`);
});
