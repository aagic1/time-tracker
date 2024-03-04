import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import userDAO from '../user/user.dao';
import { NewAccount } from '../../db/types';
import { EmailError } from '../../errors/email-error';
import { NotFoundError } from '../../errors/not-found-error';
import { Register, validateAuthJwt } from './auth.validator';
import { sendEmail } from './mailer';
import {
  generateMessageWithLink,
  generateJWT,
  generateUUID,
  generateMessageWithCode,
} from './auth.utils';
import { UnauthenticatedError } from '../../errors/not-authenticated-error';
import { BadRequestError } from '../../errors/bad-request-error';
import { UpdateError } from '../../errors/update-error';
import { CreationError } from '../../errors/creation-error';

// extract on .env
const verifyEmailURL = 'http://localhost:5173/verify-email';

async function login(email: string, password: string) {
  const user = await userDAO.findOneByEmail(email);
  if (!user) {
    throw new NotFoundError('Wrong email or password');
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new NotFoundError('Wrong email or password');
  }
  if (!user.verified) {
    throw new UnauthenticatedError('You have not verified your email.');
  }

  return { id: user.id };
}

async function register(account: Register) {
  const hashedPassword = await bcrypt.hash(account.password, 12);

  const user = await userDAO.create({
    email: account.email,
    password: hashedPassword,
  });

  if (!user) {
    throw new CreationError('Failed to register user');
  }

  const verificationCode = generateUUID();
  const hashedVerificationCode = await bcrypt.hash(verificationCode, 12);

  const codeCreationResult = await userDAO.createVerificationCode(user.id, hashedVerificationCode);
  if (!codeCreationResult.numInsertedOrUpdatedRows) {
    console.log('failed to create verification code in database. handle better?');
    return user;
  }

  try {
    await sendEmail(
      account.email,
      'Email verification',
      generateMessageWithCode('Email verification', verificationCode)
    );
  } catch (error) {
    console.log('Failed to send email');
    console.log(error);
    // don't throw this error because the user can ask to receive another code
    // throw new EmailError('Failed to send email');
  }
  return user;
}

async function verifyEmail(code: string) {
  const user = await userDAO.findUserAndVerificationCode(code);
  if (!user) {
    // this can happen if the user gets deleted while trying to verify email
    throw new NotFoundError('User not found.');
  }

  if (user.verified) {
    return {
      status: 'Failure',
      message: 'Email is already verified',
    };
  }

  if (!user.codeCreatedAt || hasCodeExpired(user.codeCreatedAt)) {
    return {
      status: 'Failure',
      message: 'Verification code expired',
    };
  }

  const updatedUser = await userDAO.update(user.email, { verified: true });
  if (!updatedUser) {
    throw new UpdateError('Something went wrong. Could not verify user');
  }
  await userDAO.deleteVerificationCode(code);

  return {
    status: 'Success',
    message: 'Email verified successfully',
  };
}

async function sendVerificationCode(email: string) {
  const user = await userDAO.findOneByEmail(email);
  if (!user) {
    throw new NotFoundError(`User with email: ${email} does not exist`);
  }
  if (user.verified) {
    return { status: 'Failure', message: 'Email is already verified' };
  }

  const verificationCode = generateUUID();
  const hashedVerificationCode = await bcrypt.hash(verificationCode, 12);
  const updateResult = await userDAO.updateVerificationCode(user.id, hashedVerificationCode);
  if (!updateResult.numChangedRows) {
    throw new Error('Failed to send new verification code.');
  }

  try {
    await sendEmail(
      email,
      'Email verification',
      generateMessageWithCode('Email verification', verificationCode)
    );
  } catch (error) {
    throw new EmailError('Failed to send email');
  }

  return { status: 'Success', message: 'Verification code sent successfully' };
}

async function sendPasswordRecoveryCode(email: string) {
  const user = await userDAO.findOneByEmail(email);
  if (!user) {
    throw new NotFoundError(`User with email: ${email} does not exist.`);
  }

  const resetToken = generateJWT(email, 'Reset password');
  try {
    await sendEmail(email, 'Reset password', resetToken);
  } catch (error) {
    throw new EmailError('Failed to send email');
  }

  return 'Reset password email sent successfully';
}

async function verifyPasswordRecoveryCode(token: string) {
  const payload = jwt.verify(token, process.env.JWT_SECRET!);
  const { email, type } = validateAuthJwt(payload);
  if (type !== 'Reset password') {
    throw new BadRequestError('Invalid verification code');
  }

  const user = await userDAO.findOneByEmail(email);
  if (!user) {
    // this can happen if account gets deleted in the process of recovering password
    throw new NotFoundError(
      'User not found. Invalid email in JWT. JWT should contain only valid email (registered emails). Server error.'
    );
  }

  return generateJWT(email, 'Reset password', '5m');
}

async function resetPassword(token: string, newPassword: string) {
  const payload = jwt.verify(token, process.env.JWT_SECRET!);
  const parsedPayload = validateAuthJwt(payload);

  if (parsedPayload.type !== 'Reset password') {
    throw new BadRequestError('Wrong code');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const updatedUser = await userDAO.update(parsedPayload.email, {
    password: hashedPassword,
  });
  if (!updatedUser) {
    throw new UpdateError('Something went wrong. Failed to reset password.');
  }
}

// ________
// Public API
export default {
  login,
  register,
  verifyEmail,
  sendVerificationCode,
  sendPasswordRecoveryCode,
  verifyPasswordRecoveryCode,
  resetPassword,
};

const VERIFICATION_CODE_MAX_AGE = 3 * 60 * 60 * 1000;

function hasCodeExpired(createdAt: Date) {
  return new Date().valueOf() - createdAt.valueOf() < VERIFICATION_CODE_MAX_AGE;
}
