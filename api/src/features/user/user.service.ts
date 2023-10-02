import bcrypt from 'bcrypt';

import userDAO from './user.dao';

async function changePassword(
  accountId: bigint,
  oldPassword: string,
  newPassword: string
) {
  const user = await userDAO.findById(accountId);
  // throw something more concrete, maybe 5xx error, server error
  if (!user) {
    throw "This shouldn't happen. User id should exist and be valid if user is loged in";
  }
  const match = await bcrypt.compare(oldPassword, user.password);
  // throw something more concrete (some custom error maybe)
  if (!match) {
    throw 'Incorrect password.';
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const updatedUser = await userDAO.update(user.email, {
    password: hashedPassword,
  });

  // throw something more concrete
  // (some custom error maybe or dberror or server error or nothing)
  if (!updatedUser) {
    throw 'Password update failed';
  }

  return updatedUser;
}

export default {
  changePassword,
};
