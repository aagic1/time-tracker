import express, { Request, Response } from 'express';

import authRouter from './user/auth/auth.router';
import userRouter from './user/user.router';
import activitiesRouter from './activity/activity.router';
import recordsRouter from './record/record.router';
import { checkAuthenticated } from './middleware/authenticate';

const apiRouter = express.Router();

apiRouter.get('/', (req: Request, res: Response) => {
  res.send('Time Tracker API');
});

apiRouter.use('/auth', authRouter);

// apiRouter.use(checkAuthenticated);

// protected routes - only logged in users with valid session
apiRouter.use('/users', checkAuthenticated, userRouter);
apiRouter.use('/activities', checkAuthenticated, activitiesRouter);
apiRouter.use('/records', checkAuthenticated, recordsRouter);
apiRouter.use('*', (req: Request, res: Response) => {
  res.status(404).send('Not Found');
});

export default apiRouter;
