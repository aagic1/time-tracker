import crypto from 'crypto';

import jwt from 'jsonwebtoken';

import { Message } from './auth.types';

export function generateJWT(email: string, type: Message, expiresIn = '30m') {
  return jwt.sign({ email, type }, process.env.JWT_SECRET!, {
    expiresIn,
  });
}

export function generateUUID() {
  return crypto.randomUUID();
}
