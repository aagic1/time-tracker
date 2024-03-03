import crypto from 'crypto';

import jwt from 'jsonwebtoken';

import { Message } from './auth.types';

export function generateToken(
  email: string,
  type: 'Email verification' | 'Reset password',
  expiresIn = '30m'
) {
  return jwt.sign({ email, type }, process.env.JWT_SECRET!, {
    expiresIn,
  });
}

export function generateUUID() {
  return crypto.randomUUID();
}
