import nodemailer from 'nodemailer';
import { MailtrapTransport } from 'mailtrap';
import dotenv from 'dotenv';
dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN;

if (!TOKEN) {
  throw new Error('MAILTRAP_TOKEN is not defined in environment variables.');
}

const transport = nodemailer.createTransport(
  MailtrapTransport({
    token: TOKEN,
  })
);

const sender = {
  address: "felipeskubs@demomailtrap.co",
  name: "Felipe Skubs Oliveira",
};

/**
 * Envia email usando Mailtrap
 * @param {string} to - Email do destinatário
 * @param {string} subject - Assunto do email
 * @param {string} text - Texto do email
 * @returns {Promise} - Promise que resolve quando o email for enviado
 */

async function sendEmail(to, subject, text) {
  if (!to) throw new Error("Destinatário 'to' é obrigatório.");
  if (!subject) throw new Error("Assunto 'subject' é obrigatório.");
  if (!text) throw new Error("Texto 'text' é obrigatório.");

  const mailOptions = {
    from: sender,
    to,
    subject,
    text,
  };

  return transport.sendMail(mailOptions);
}

export default {
  sendEmail,
};
