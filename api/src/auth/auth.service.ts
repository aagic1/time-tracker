import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import userDAO from '../user/user.dao';
import { NewAccount } from '../db/types';
import { NotFoundError } from '../errors/not-found.error';
import { validateAuthJwt, validatePassword } from './auth.validator';

async function login(email: string, password: string) {
  const user = await userDAO.findByEmail(email);
  if (!user) {
    throw new NotFoundError('Wrong email or password');
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new NotFoundError('Wrong email or password');
  }
  if (!user.verified) {
    throw new Error('You have not verified your email.');
  }

  return { id: user.id };
}

// later add logic for email verification upon registration - send verification code to email adress, user has to verify to complete registration
async function register(account: NewAccount) {
  const hashedPassword = await bcrypt.hash(account.password, 10);

  const user = await userDAO.create({
    ...account,
    password: hashedPassword,
  });

  try {
    // is this try catch needed
    const info = await sendEmailTo(account.email, 'Email verification');
    console.log(`Email sent successfully.`);
    return user;
  } catch (err) {
    // maybe better error handling
    console.log(err);
    console.log('Email could not be sent. Error');
    throw err;
  }
}

function generateToken(
  email: string,
  type: 'Email verification' | 'Reset password'
) {
  return jwt.sign({ email, type }, process.env.JWT_SECRET!, {
    expiresIn: '30m',
  });
}

async function sendEmailTo(
  email: string,
  type: 'Email verification' | 'Reset password'
) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  return transporter.sendMail({
    from: process.env.GMAIL_EMAIL,
    to: email,
    subject: type,
    text: `Your ${type} code:\n${generateToken(email, type)}`,
  });
}

async function verifyEmail(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const { email, type } = validateAuthJwt(decoded);
    if (type !== 'Email verification') {
      throw 'Invalid verification code';
    }

    const user = await userDAO.findByEmail(email);
    if (!user) {
      // this should never be true. Again, jwt.verify should fail
      throw "Email doesn't exist. Unexpected jwt email. JWT should contain only valid email, that is, registered emails. This should not happen... Server error";
    }

    if (user.verified) {
      return {
        status: 'Failure',
        message: 'Email is already verified',
      };
    }

    // check for error? or manybe not
    const updatedUser = await userDAO.update(email, { verified: true });
    if (!updatedUser) {
      throw 'Something went wrong while updating user to verified user';
    }
    return {
      status: 'Success',
      message: 'Email verified successfully',
      user: { id: updatedUser.id },
    };
  } catch (err) {
    // check different types of verify errors
    // expired, not valid jwt...
    throw err;
  }
}

async function sendVerificationCode(email: string) {
  const user = await userDAO.findByEmail(email);
  if (!user) {
    throw new NotFoundError(`User with email: ${email} does not exist.`);
  }
  await sendEmailTo(email, 'Email verification');
  console.log(`Verification email sent successfully.`);
  return 'Confirmation code successfully sent to your email';
}

async function sendResetPasswordCode(email: string) {
  const user = await userDAO.findByEmail(email);
  if (!user) {
    throw new NotFoundError(`User with email: ${email} does not exist.`);
  }
  await sendEmailTo(email, 'Reset password');
  console.log(`Reset email sent successfully.`);
  return 'Reset password code successfully sent to your email';
}

async function resetPassword(token: string, password: string) {
  try {
    const newPassword = validatePassword(password);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    const parsedToken = validateAuthJwt(decodedToken);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await userDAO.update(parsedToken.email, {
      password: hashedPassword,
    });
    if (!updatedUser) {
      throw 'Failed to update password. Server error';
    }
    return {
      status: 'Success',
      message: 'Password changed successfully',
    };
  } catch (err) {
    throw err;
  }
}

export default {
  login,
  register,
  verifyEmail,
  sendVerificationCode,
  sendResetPasswordCode,
  resetPassword,
};
