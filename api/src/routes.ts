import express from 'express';

import authRouter from './user/auth/auth.router';
import userRouter from './user/user.router';
import activitiesRouter from './activity/activity.router';
import { checkAuthenticated } from './middleware/authenticate';

const apiRouter = express.Router();

// public routes
apiRouter.use('/auth', authRouter);

apiRouter.use(checkAuthenticated);

// protected routes - only logged in users with valid session
apiRouter.use('/users', userRouter);
apiRouter.use('/activities', activitiesRouter);

export default apiRouter;
