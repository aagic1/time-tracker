import userDAO from '../user.dao';
import bcrypt from 'bcrypt';
import { NewAccount } from '../../db/types';

async function login(email: string, password: string) {
  try {
    const user = await userDAO.findByEmail(email);
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw 'Wrong username or password';
    }
    return { id: user.id };
  } catch (err) {
    throw 'Wrong username or password';
  }
}

// later add logic for email verification upon registration - send verification code to email adress, user has to verify to complete registration
async function register(account: NewAccount) {
  try {
    const hashedPassword = await bcrypt.hash(account.password, 10);
    const user = await userDAO.create({
      ...account,
      password: hashedPassword,
    });
    return user;
  } catch (err) {
    throw err;
  }
}

export default {
  login,
  register,
};
