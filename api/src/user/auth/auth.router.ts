import express from 'express';
import {
  login,
  register,
  logout,
  verifyEmail,
  resendVerificationCode,
  forgotPassword,
  resetPassword,
} from './auth.controller';
import { checkNotAuthenticated } from '../../middleware/authenticate';

const authRouter = express.Router();

authRouter.route('/logout').post(logout);
authRouter.route('/login').post(checkNotAuthenticated, login);
authRouter.route('/register').post(checkNotAuthenticated, register);
authRouter.route('/forgot-password').post(forgotPassword);
authRouter.route('/reset-password').post(resetPassword);
authRouter.route('/verify-email/resend').post(resendVerificationCode);
authRouter.route('/verify-email/:token').post(verifyEmail);

export default authRouter;
