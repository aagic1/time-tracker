import { Request, Response } from 'express';
import userDAO from '../user.dao';

export function login(req: Request, res: Response) {
  const result = userDAO.findById();
  res.send(result);
}

export function register(req: Request, res: Response) {
  const result = userDAO.create();
  res.send(result);
}
