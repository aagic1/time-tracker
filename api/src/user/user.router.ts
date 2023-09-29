import express from 'express';
import { changePassword } from './user.controller';

const userRouter = express.Router();

userRouter.route('/change-password').post(changePassword);

export default userRouter;
