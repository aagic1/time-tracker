import { Request, Response } from 'express';
import authService from './auth.service';
import {
  passwordRecoverySchema,
  loginSchema,
  registerSchema,
  resendVerificationCodeSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  verifyPasswordRecoverySchema,
} from './auth.validator';
import { validateRequest } from '../../utils/validation.util';

export async function login(req: Request, res: Response) {
  const { body } = await validateRequest(loginSchema, req, 'Invalid request data: POST /login');
  const user = await authService.login(body.email, body.password);
  req.session.user = { ...user, email: body.email };
  res.status(200).json('Logged in succesfully');
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
    res.status(200).json('Logged out successfully');
  });
}

export async function register(req: Request, res: Response) {
  const { body } = await validateRequest(
    registerSchema,
    req,
    'Invalid request data: POST /register'
  );
  await authService.register(body);
  res.status(201).json('User created successfully');
}

export async function verifyEmail(req: Request, res: Response) {
  const {
    body: { code, email },
  } = await validateRequest(verifyEmailSchema, req, 'Invalid request data: PATCH /verify-email');
  const result = await authService.verifyEmail(email, code);
  if (result.status === 'Success') {
    res.status(200).json(result.message);
  } else if (result.status === 'Already verified') {
    res.status(409).json({ error: { message: result.message } });
  } else {
    res.status(422).json({ error: { message: result.message } });
  }
}

export async function resendVerificationCode(req: Request, res: Response) {
  const { body } = await validateRequest(
    resendVerificationCodeSchema,
    req,
    'Invalid request data: PATCH /verify-email/resend'
  );

  const result = await authService.sendVerificationCode(body.email);
  if (result.status === 'Success') {
    res.status(200).json(result.message);
  } else {
    res.status(409).json({ error: { message: result.message } });
  }
}

export async function sendPasswordRecoveryCode(req: Request, res: Response) {
  const { body } = await validateRequest(
    passwordRecoverySchema,
    req,
    'Invalid request data: PATCH /forgot-password/initiate'
  );
  const message = await authService.sendPasswordRecoveryCode(body.email);
  res.status(200).json(message);
}

export async function verifyPasswordRecoveryCode(req: Request, res: Response) {
  const {
    body: { code, email },
  } = await validateRequest(
    verifyPasswordRecoverySchema,
    req,
    'Invalid request data: PATCH /forgot-password/code'
  );
  const passwordResetResult = await authService.verifyPasswordRecoveryCode(email, code);

  if (passwordResetResult.status === 'Failure') {
    return res.status(422).json({ error: { message: passwordResetResult.message } });
  }
  res.status(200).json(passwordResetResult.message);
}

export async function resetPassword(req: Request, res: Response) {
  const {
    body: { email, newPassword, code },
  } = await validateRequest(
    resetPasswordSchema,
    req,
    'Invalid request data: PATCH /forgot-password/password'
  );
  const result = await authService.resetPassword(email, code, newPassword);
  if (result.status === 'Failure') {
    res.status(422).json({ error: { message: result.message } });
  }
  res.status(200).json('Password reset successfully');
}

export async function whoami(req: Request, res: Response) {
  if (!req.session || !req.session.user) {
    return res.json(null);
  }
  return res.json(req.session.user!.email);
}
