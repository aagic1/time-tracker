import { Request, Response } from 'express';
import bcrypt, { hash } from 'bcrypt';

import userDAO from './user.dao';
import { validatePassword } from '../auth/auth.validator';

export async function changePassword(req: Request, res: Response) {
  const oldPassword = validatePassword(req.body.oldPassword);
  const newPassword = validatePassword(req.body.newPassword);
  const user = await userDAO.findById(req.session.user!.id);
  if (!user) {
    throw "This shouldn't happen. User id should exist and be valid if user is loged in";
  }
  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) {
    throw 'Incorrect password.';
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const updatedUser = await userDAO.update(user.email, {
    password: hashedPassword,
  });

  if (!updatedUser) {
    throw 'Password update failed';
  }

  return res.status(200).send('Password updated successfully');
}
