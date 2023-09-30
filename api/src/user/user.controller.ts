import { Request, Response } from 'express';
import bcrypt, { hash } from 'bcrypt';

import userDAO from './user.dao';
import { validateRequest } from '../utils/validation.util';
import { changePasswordRequestSchema } from './user.validator';

export async function changePassword(req: Request, res: Response) {
  const {
    body: { oldPassword, newPassword },
  } = await validateRequest(
    changePasswordRequestSchema,
    req,
    'Invalid change password request data'
  );

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
