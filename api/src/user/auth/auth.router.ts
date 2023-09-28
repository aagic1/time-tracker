import express from 'express';
import {
  login,
  register,
  logout,
  verifyEmail,
  resendVerificationCode,
} from './auth.controller';
import { checkNotAuthenticated } from '../../middleware/authenticate';

const authRouter = express.Router();

authRouter.route('/logout').post(logout);
authRouter.route('/login').post(checkNotAuthenticated, login);
authRouter.route('/register').post(checkNotAuthenticated, register);
authRouter.route('/verify-email/:token').post(verifyEmail);

export default authRouter;
