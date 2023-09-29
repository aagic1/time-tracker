import express from 'express';
import authRouter from './auth/auth.router';
import { changePassword } from './user.controller';

const userRouter = express.Router();

// userRouter.use('/', authRouter);

userRouter.route('/change-password').post(changePassword);

export default userRouter;
