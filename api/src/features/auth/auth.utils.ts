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

function generateMessageWithCode(type: Message, code: string) {
  let message;
  if (type === 'Email verification') {
    message = 'Use this code to verify your email: ';
  } else {
    message = 'Use this code to reset your password: ';
  }
  return `
    <h2>${type}</h2>
    <p>${message}</p>
    <p><b>${code}</b></p>
  `;
}

function generateVerificationLinkMessage(type: Message, redirectURL: string) {
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

export { generateJWT, generateUUID, generateVerificationLinkMessage };
