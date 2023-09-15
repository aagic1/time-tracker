import express from 'express';
import authRouter from './auth/auth.router';

const userRouter = express.Router();

userRouter.use('/', authRouter);

export default userRouter;
