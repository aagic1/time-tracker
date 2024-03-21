import express, { Request, Response } from 'express';

import authRouter from './features/auth/auth.router';
import userRouter from './features/user/user.router';
import activitiesRouter from './features/activity/activity.router';
import recordsRouter from './features/record/record.router';
import { checkAuthenticated } from './middleware/authenticate';

const apiRouter = express.Router();

apiRouter.get('/api/v1', (req: Request, res: Response) => {
  res.json('Time Tracker API');
});

apiRouter.use('/api/v1/auth', authRouter);

// protected routes - only logged in users with valid session
apiRouter.use('/api/v1/users', checkAuthenticated, userRouter);
apiRouter.use('/api/v1/activities', checkAuthenticated, activitiesRouter);
apiRouter.use('/api/v1/records', checkAuthenticated, recordsRouter);

// NOT FOUND route
apiRouter.use('*', (req: Request, res: Response) => {
  res.status(404).json('Not Found');
});

export default apiRouter;
