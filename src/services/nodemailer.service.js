import { createTransport } from 'nodemailer';

import welcomeEmailTemplate from '../templates/welcomeEmail.template.js';

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

const sendEmail = async (mailOptions) => {
  return transporter.sendMail(mailOptions);
};

const sendWelcomeEmail = async (email, fullName) => {
  const mailOptions = {
    from: `Social Space <${process.env.EMAIL}>`,
    to: email,
    subject: 'Welcome to Social Space ! 🖐🏻',
    html: welcomeEmailTemplate(fullName),
  };

  await sendEmail(mailOptions);
};

export default {
  sendWelcomeEmail,
};
