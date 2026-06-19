import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is missing.');
  }

  if (!process.env.EMAIL_FROM) {
    throw new Error('EMAIL_FROM is missing.');
  }

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });

  if (error) {
    console.error('Resend email error:', error);
    throw new Error(error.message || 'Failed to send email.');
  }

  return data;
};

export default sendEmail;