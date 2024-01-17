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
import { checkNotAuthenticated } from '../../middleware/authenticate';

const authRouter = express.Router();

authRouter.route('/login').post(checkNotAuthenticated, login);
authRouter.route('/logout').post(logout);
authRouter.route('/register').post(register);
authRouter.route('/verify-email').patch(verifyEmail);
authRouter.route('/verify-email/resend').post(resendVerificationCode);
// authRouter.route('/forgot-password/initiate').post(forgotPassword);
authRouter.route('/forgot-password/initiate').post(sendPasswordRecoveryCode);
authRouter.route('/forgot-password/code').post(verifyPasswordRecoveryCode);
authRouter.route('/forgot-password/password').patch(resetPassword);
// authRouter.route('/reset-password').patch(resetPassword);

authRouter.route('/whoami').get((req, res) => {
  console.log(req.session);
  if (!req.session || !req.session.user) {
    return res.json(null);
  }
  return res.json(req.session.user?.email);
});

export default authRouter;
