import jwt from 'jsonwebtoken';

export function generateToken(email: string, type: 'Email verification' | 'Reset password') {
  return jwt.sign({ email, type }, process.env.JWT_SECRET!, {
    expiresIn: '30m',
  });
}
