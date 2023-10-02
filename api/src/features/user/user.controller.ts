import { Request, Response } from 'express';

import { validateRequest } from '../../utils/validation.util';
import { changePasswordRequestSchema } from './user.validator';
import userService from './user.service';

export async function changePassword(req: Request, res: Response) {
  const {
    body: { oldPassword, newPassword },
  } = await validateRequest(
    changePasswordRequestSchema,
    req,
    'Invalid change password request data'
  );

  await userService.changePassword(
    req.session.user!.id,
    oldPassword,
    newPassword
  );
  return res.status(200).send('Password updated successfully');
}
