import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import userDAO from '../user/user.dao';
import { NewAccount } from '../../db/types';
import { EmailError } from '../../errors/email-error';
import { NotFoundError } from '../../errors/not-found-error';
import { Register, validateAuthJwt } from './auth.validator';
import { sendEmail } from './mailer';
import { generateVerificationLinkMessage, generateJWT, generateUUID } from './auth.utils';
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

  const verificationID = generateUUID();
  const hashedVerificationID = await bcrypt.hash(verificationID, 12);

  const codeCreationResult = await userDAO.createVerificationCode(user.id, hashedVerificationID);
  if (!codeCreationResult) {
    console.log('failed to create verification code in database. handle better?');
    return user;
  }

  const redirectURL = verifyEmailURL + '?id=' + verificationID;
  try {
    await sendEmail(
      account.email,
      'Email verification',
      generateVerificationLinkMessage('Email verification', redirectURL)
    );
  } catch (error) {
    console.log('Failed to send email');
    console.log(error);
    // don't throw this error because the user can ask to receive another code
    // throw new EmailError('Failed to send email');
  }
  return user;
}

async function verifyEmail(token: string) {
  const payload = jwt.verify(token, process.env.JWT_SECRET!);
  const { email, type } = validateAuthJwt(payload);
  if (type !== 'Email verification') {
    throw new BadRequestError('Wrong verification code');
  }

  const user = await userDAO.findOneByEmail(email);
  if (!user) {
    // this can happen if the user gets deleted while trying to verify email
    throw new NotFoundError(
      'User not found. Invalid email in JWT. JWT should contain only valid email (registered emails). Server error.'
    );
  }

  if (user.verified) {
    return {
      status: 'Failure',
      message: 'Email is already verified',
    };
  }

  const updatedUser = await userDAO.update(email, { verified: true });
  if (!updatedUser) {
    throw new UpdateError('Something went wrong. Could not verify user');
  }

  return {
    status: 'Success',
    message: 'Email verified successfully',
  };
}

async function sendVerificationCode(email: string) {
  const user = await userDAO.findOneByEmail(email);
  if (!user) {
    throw new NotFoundError(`User with email: ${email} does not exist.`);
  }
  if (user.verified) {
    return { status: 'Failure', message: 'Email is already verified' };
  }

  const verificationToken = generateJWT(email, 'Email verification');
  try {
    await sendEmail(email, 'Email verification', verificationToken);
    console.log(`Verification email sent successfully.`);
  } catch (error) {
    throw new EmailError('Failed to send email');
  }

  return { status: 'Success', message: 'Confirmation code successfully sent to your email' };
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
