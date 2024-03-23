import bcrypt from 'bcrypt';

import userDAO from '../user/user.dao';
import { EmailError } from '../../errors/email-error';
import { NotFoundError } from '../../errors/not-found-error';
import { Register } from './auth.validator';
import { sendEmail } from './mailer';
import { generateUUID, generateMessageWithCode } from './auth.utils';
import { UnauthenticatedError } from '../../errors/not-authenticated-error';
import { UpdateError } from '../../errors/update-error';
import { CreationError } from '../../errors/creation-error';

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

async function verifyEmail(email: string, code: string) {
  const user = await userDAO.findUserAndVerificationCode(email);
  if (!user) {
    // this can happen if the user gets deleted while trying to verify email
    throw new NotFoundError('User not found.');
  }

  if (user.verified) {
    return {
      status: 'Already verified',
      message: 'Email is already verified',
    };
  }

  if (!user.codeCreatedAt || hasCodeExpired(user.codeCreatedAt)) {
    return {
      status: 'Failure',
      message: 'Verification code expired',
    };
  }

  const codeValid = await bcrypt.compare(code, user.verificationCode!);
  if (!codeValid) {
    return {
      status: 'Failure',
      message: 'Invalid verification code',
    };
  }

  const updatedUser = await userDAO.update(user.email, { verified: true });
  if (!updatedUser) {
    throw new UpdateError('Something went wrong. Could not verify user');
  }
  await userDAO.deleteVerificationCode(user.accountId);

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
  if (!updateResult.numUpdatedRows) {
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

  const resetCode = generateUUID();
  const hashedResetCode = await bcrypt.hash(resetCode, 12);
  const insertOrUpdateResult = await userDAO.createOrUpdateRecoveryCode(user.id, hashedResetCode);
  if (!insertOrUpdateResult.numInsertedOrUpdatedRows) {
    return new Error('Failed to create recover code');
  }

  try {
    await sendEmail(
      email,
      'Reset password',
      generateMessageWithCode('Email verification', resetCode)
    );
  } catch (error) {
    throw new EmailError('Failed to send email');
  }

  return 'Password recovery email sent successfully';
}

async function verifyPasswordRecoveryCode(email: string, code: string) {
  const user = await userDAO.findUserAndRecoveryCode(email);
  if (!user) {
    // this can happen if account gets deleted in the process of recovering password
    throw new NotFoundError('User not found.');
  }

  if (!user.codeCreatedAt || hasCodeExpired(user.codeCreatedAt)) {
    return {
      status: 'Failure',
      message: 'Password recovery code has expired',
    };
  }

  const codeValid = await bcrypt.compare(code, user.recoveryCode!);
  if (!codeValid) {
    return {
      status: 'Failure',
      message: 'Invalid verification code',
    };
  }

  return {
    status: 'Success',
    message: 'Recovery code verified successfully',
  };
}

async function resetPassword(email: string, code: string, newPassword: string) {
  const recoveryCodeVerification = await verifyPasswordRecoveryCode(email, code);
  if (recoveryCodeVerification.status === 'Failure') {
    return recoveryCodeVerification;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  const updatedUser = await userDAO.update(email, {
    password: hashedPassword,
  });

  if (!updatedUser) {
    throw new UpdateError('Something went wrong. Failed to reset password.');
  }
  await userDAO.deleteRecoveryCode(updatedUser.id);
  return {
    status: 'Success',
    message: 'Password reset successfully.',
  };
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
  const expiredTime = new Date().valueOf() - createdAt.valueOf();
  return expiredTime > VERIFICATION_CODE_MAX_AGE;
}
