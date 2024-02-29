import jwt from 'jsonwebtoken';

export function generateToken(
  email: string,
  type: 'Email verification' | 'Reset password',
  expiresIn = '30m'
) {
  return jwt.sign({ email, type }, process.env.JWT_SECRET!, {
    expiresIn,
  });
}
