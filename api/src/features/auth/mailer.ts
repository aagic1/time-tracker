import nodemailer from 'nodemailer';

const EMAIL = process.env.GMAIL_EMAIL;
const PASSWORD = process.env.GMAIL_PASSWORD;

export async function sendEmail(
  to: string,
  type: 'Email verification' | 'Reset password',
  token: string
) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  });

  return transporter.sendMail({
    from: EMAIL,
    to: to,
    subject: type,
    text: `Your ${type} code:\n\n${token}`,
  });
}
