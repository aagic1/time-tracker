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
import {
  checkNotAuthenticated,
  checkAuthenticated,
} from '../../middleware/authenticate';

const notAuthenticatedRoutes = express.Router();
notAuthenticatedRoutes.use(checkNotAuthenticated);
notAuthenticatedRoutes.route('/login').post(login);
notAuthenticatedRoutes.route('/register').post(register);
notAuthenticatedRoutes.route('/verify-email').patch(verifyEmail);
notAuthenticatedRoutes
  .route('/verify-email/resend')
  .post(resendVerificationCode);
notAuthenticatedRoutes
  .route('/forgot-password/initiate')
  .post(sendPasswordRecoveryCode);
notAuthenticatedRoutes
  .route('/forgot-password/code')
  .post(verifyPasswordRecoveryCode);
notAuthenticatedRoutes.route('/forgot-password/password').patch(resetPassword);

const authRouter = express.Router();
authRouter.route('/logout').post(checkAuthenticated, logout);
authRouter.route('/whoami').get((req, res) => {
  console.log(req.session);
  if (!req.session || !req.session.user) {
    return res.json(null);
  }
  return res.json(req.session.user?.email);
});
authRouter.use(notAuthenticatedRoutes);

export default authRouter;
