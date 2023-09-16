import express from 'express';
import { login, register, logout } from './auth.controller';
import { checkNotAuthenticated } from '../../middleware/authenticate';

const authRouter = express.Router();

authRouter.route('/logout').post(logout);
authRouter.route('/login').post(checkNotAuthenticated, login);
authRouter.route('/register').post(checkNotAuthenticated, register);

export default authRouter;
