import userDAO from '../user.dao';
import bcrypt from 'bcrypt';

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

export default {
  login,
};
