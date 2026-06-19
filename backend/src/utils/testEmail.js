import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const from = process.env.EMAIL_FROM || 'Acme <onboarding@resend.dev>';

const to =
  process.argv[2] || process.env.TEST_EMAIL_TO || 'kingjukur@gmail.com';
const subject = process.argv[3] || 'Hello from Resend!';
const html =
  process.argv[4] ||
  "<h1>Welcome!</h1><p>This email was sent using Resend's Node.js SDK.</p>";

const run = async () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is missing.');
  }

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    html,
    text: "Welcome! This email was sent using Resend's Node.js SDK.",
  });

  if (error) {
    console.error('Error sending email:', error);
    process.exit(1);
  }

  console.log('Email sent successfully!');
  console.log('Email ID:', data?.id);
};

run().catch((error) => {
  console.error('Failed to send test email:', error);
  process.exit(1);
});
