import { Request, Response } from 'express';
import userDAO from '../user.dao';
import authService from './auth.service';

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const user = await authService.login(email, password);
    req.session.user = user;
    res.status(200).send('Logged in succesfully');
  } catch (err) {
    if (err instanceof Error) {
      res.status(404).json({ msg: err.message });
    } else if (typeof err === 'string') {
      res.status(404).json({ msg: err });
    }
  }
}

export async function register(req: Request, res: Response) {
  const { email, password, username } = req.body;
  try {
    const user = await authService.register({ email, username, password });
    res.status(201).send('User created successfully');
  } catch (err) {
    if (err instanceof Error) {
      res.status(404).json({ msg: err.message });
    } else if (typeof err === 'string') {
      res.status(404).json({ msg: err });
    }
  }
}

export async function logout(req: Request, res: Response) {
  if (!req.session.user) {
    return res.status(204).end();
  }

  req.session.destroy((err) => {
    if (err) {
      return res.status(400).send('Unable to log out');
    }
    res.clearCookie('sessionId');
    res.send('Logged out successfully');
  });
}
