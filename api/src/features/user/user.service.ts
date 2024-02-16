import bcrypt from 'bcrypt';

import userDAO from './user.dao';
import { NotFoundError } from '../../errors/not-found-error';
import { WrongPasswordError } from '../../errors/wrong-password-error';
import { UpdateError } from '../../errors/update-error';

async function changePassword(accountId: bigint, oldPassword: string, newPassword: string) {
  const user = await userDAO.findOne(accountId);
  if (!user) {
    console.log("This shouldn't happen. User id should exist and be valid if user is logged in");
    throw new NotFoundError('Your session expired or account does not exist.');
  }

  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) {
    throw new WrongPasswordError('Incorrect password');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const updatedUser = await userDAO.update(user.email, {
    password: hashedPassword,
  });

  if (!updatedUser) {
    throw new UpdateError('Password update failed');
  }

  return updatedUser;
}

export default {
  changePassword,
};
