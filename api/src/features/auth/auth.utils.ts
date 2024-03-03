import crypto from 'crypto';

import jwt from 'jsonwebtoken';

import { Message } from './auth.types';

function generateJWT(email: string, type: Message, expiresIn = '30m') {
  return jwt.sign({ email, type }, process.env.JWT_SECRET!, {
    expiresIn,
  });
}

function generateUUID() {
  return crypto.randomUUID();
}

function generateEmailMessage(type: Message, redirectURL: string) {
  let message;
  if (type === 'Email verification') {
    message = 'Click on the following link to reset your password:';
  } else {
    message = 'Click on the following link to verify your account:';
  }
  return `
    <h2>${type}</h2>
    <p>${message}</p>
    <a href=${redirectURL}>${redirectURL}</a>
  `;
}

export { generateJWT, generateUUID, generateEmailMessage };
