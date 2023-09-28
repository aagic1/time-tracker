import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import userDAO from '../user.dao';
import { NewAccount } from '../../db/types';
import { NotFoundError } from '../../errors/not-found.error';

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
    const info = await sendEmailTo(account.email);
    console.log(`Email sent successfully.`);
    return user;
  } catch (err) {
    // maybe better error handling
    console.log(err);
    console.log('Email could not be sent. Error');
    throw err;
  }
}

function generateToken(recipientEmail: string) {
  return jwt.sign({ email: recipientEmail }, process.env.JWT_SECRET!, {
    expiresIn: '30m',
  });
}

async function sendEmailTo(email: string) {
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
    subject: 'Email Verification',
    text: `Your verification code: 
    ${generateToken(email)}`,
  });
}

export default {
  login,
  register,
};
