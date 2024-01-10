import { Request, Response } from 'express';
import authService from './auth.service';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendVerificationCodeSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from './auth.validator';
import { validateRequest } from '../../utils/validation.util';

export async function login(req: Request, res: Response) {
  const { body } = await validateRequest(
    loginSchema,
    req,
    'Invalid login request data'
  );
  const user = await authService.login(body.email, body.password);
  req.session.user = { ...user, email: body.email };
  res.status(200).send('Logged in succesfully');
}

export async function register(req: Request, res: Response) {
  const { body } = await validateRequest(
    registerSchema,
    req,
    'Invalid register request data'
  );
  await authService.register(body);
  res.status(201).json('User created successfully');
}

export async function logout(req: Request, res: Response) {
  if (!req.session.user) {
    return res.status(204).end();
  }

  req.session.destroy((err) => {
    if (err) {
      throw err;
    }
    res.clearCookie('sessionId');
    res.status(200).send('Logged out successfully');
  });
}

export async function verifyEmail(req: Request, res: Response) {
  const { body } = await validateRequest(
    verifyEmailSchema,
    req,
    'Invalid verify email payload'
  );
  const result = await authService.verifyEmail(body.token);
  if (result.status === 'Success') {
    res.status(200).json({ msg: result.message });
  } else if (result.status === 'Failure') {
    res.status(409).json({ msg: result.message });
  } else {
    res
      .status(400)
      .json({ msg: 'Some server error in verifyEmail controller' });
  }
}

export async function resendVerificationCode(req: Request, res: Response) {
  const { body } = await validateRequest(
    resendVerificationCodeSchema,
    req,
    'Invalid email'
  );

  const message = await authService.sendVerificationCode(body.email);
  res.status(200).send(message);
}

export async function forgotPassword(req: Request, res: Response) {
  const { body } = await validateRequest(
    forgotPasswordSchema,
    req,
    'Invalid email'
  );
  const message = await authService.sendResetPasswordCode(body.email);
  res.status(200).send(message);
}

export async function resetPassword(req: Request, res: Response) {
  const { body } = await validateRequest(
    resetPasswordSchema,
    req,
    'Invalid email or password'
  );
  const result = await authService.resetPassword(body.token, body.newPassword);
  res.status(200).json({ msg: result.message });
}
