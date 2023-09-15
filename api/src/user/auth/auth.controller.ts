import { Request, Response } from 'express';
import userDAO from '../user.dao';
import authService from './auth.service';

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const user = await authService.login(email, password);
    req.session.user = user;
    res.sendStatus(204);
  } catch (err) {
    if (err instanceof Error) {
      res.status(404).json({ msg: err.message });
    } else if (typeof err === 'string') {
      res.status(404).json({ msg: err });
    }
  }
}

export function register(req: Request, res: Response) {
  const result = userDAO.create();
  res.send(result);
}
