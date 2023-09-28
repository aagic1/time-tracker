import { Request, Response } from 'express';
import authService from './auth.service';
import {
  validateLoginPayload,
  validateRegisterPayload,
  validateResendConfirmationPayload,
} from './auth.validator';

export async function login(req: Request, res: Response) {
  const { email, password } = validateLoginPayload(req.body);
  const user = await authService.login(email, password);
  req.session.user = user;
  res.status(200).send('Logged in succesfully');
}

export async function register(req: Request, res: Response) {
  const registerData = validateRegisterPayload(req.body);
  await authService.register(registerData);
  res.status(201).send('User created successfully');
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
  const result = await authService.verifyEmail(req.params.token.trim());
  if (result.status === 'Success') {
    req.session.user = result.user;
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
  const { email } = validateResendConfirmationPayload(req.body);

  const message = await authService.sendVerificationCode(email);
  res.status(200).send(message);
}
