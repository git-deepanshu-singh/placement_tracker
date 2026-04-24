import nodemailer from 'nodemailer';
import { isSmtpConfigured } from './env.js';

let transporter;

const getTransporter = () => {
  if (!isSmtpConfigured()) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return transporter;
};

export const sendEmail = async ({ to, subject, html }) => {
  if (!to || !subject || !html) {
    return false;
  }

  const activeTransporter = getTransporter();
  if (!activeTransporter) {
    console.warn('SMTP is not configured. Skipping email send.');
    return false;
  }

  await activeTransporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
  });

  return true;
};
