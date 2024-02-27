import express from 'express';
import {
  login,
  register,
  logout,
  verifyEmail,
  resendVerificationCode,
  sendPasswordRecoveryCode,
  verifyPasswordRecoveryCode,
  resetPassword,
} from './auth.controller';
import { checkNotAuthenticated, checkAuthenticated } from '../../middleware/authenticate';

const authRouter = express.Router();

// routes accessible to ALL users (whether logged in or not)
authRouter.route('/whoami').get((req, res) => {
  if (!req.session || !req.session.user) {
    return res.json(null);
  }
  return res.json(req.session.user?.email);
});

// routes accessible only to users that ARE logged in
authRouter.route('/logout').post(checkAuthenticated, logout);

// routes accessible only to users that ARE NOT logged in
authRouter.use(checkNotAuthenticated);
authRouter.route('/login').post(login);
authRouter.route('/register').post(register);
authRouter.route('/verify-email').patch(verifyEmail);
authRouter.route('/verify-email/resend').post(resendVerificationCode);
authRouter.route('/forgot-password/initiate').post(sendPasswordRecoveryCode);
authRouter.route('/forgot-password/code').post(verifyPasswordRecoveryCode);
authRouter.route('/forgot-password/password').patch(resetPassword);

// ________
// public API
export default authRouter;
