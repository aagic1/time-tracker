import userDAO from '../user.dao';
import bcrypt from 'bcrypt';
import { NewAccount } from '../../db/types';
import { NotFoundError } from '../../errors/not-found.error';

async function login(email: string, password: string) {
  const user = await userDAO.findByEmail(email);
  if (!user) {
    throw new NotFoundError('Wrong email or password');
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new NotFoundError('Wrong email or password');
  }
  if (!user.verified) {
    throw new Error('You have not verified your email.');
  }

  return { id: user.id };
}

// later add logic for email verification upon registration - send verification code to email adress, user has to verify to complete registration
async function register(account: NewAccount) {
  const hashedPassword = await bcrypt.hash(account.password, 10);

  const user = await userDAO.create({
    ...account,
    password: hashedPassword,
  });
  return user;
}

export default {
  login,
  register,
};
