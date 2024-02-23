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

// routes accessible only to users that ARE logged in
authRouter.route('/logout').post(checkAuthenticated, logout);

// routes accessible only to users that ARE NOT logged in
const notAuthenticatedRouter = express.Router();
notAuthenticatedRouter.use(checkNotAuthenticated);

notAuthenticatedRouter.route('/login').post(login);
notAuthenticatedRouter.route('/register').post(register);
notAuthenticatedRouter.route('/verify-email').patch(verifyEmail);
notAuthenticatedRouter.route('/verify-email/resend').post(resendVerificationCode);
notAuthenticatedRouter.route('/forgot-password/initiate').post(sendPasswordRecoveryCode);
notAuthenticatedRouter.route('/forgot-password/code').post(verifyPasswordRecoveryCode);
notAuthenticatedRouter.route('/forgot-password/password').patch(resetPassword);

authRouter.use(notAuthenticatedRouter);

// routes accessible to ALL users (whether logged in or not)
authRouter.route('/whoami').get((req, res) => {
  if (!req.session || !req.session.user) {
    return res.json(null);
  }
  return res.json(req.session.user?.email);
});

// ________
// public API
export default authRouter;
