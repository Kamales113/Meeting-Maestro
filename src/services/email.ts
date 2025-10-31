/*
 * @fileoverview This file contains the email service for the application.
 *
 * Since there is no real email provider integrated, this service simulates
 * sending an email by logging the details to the console. In a real-world
 * scenario, you would replace the console.log with a call to an email
 * service provider like SendGrid, Mailgun, or AWS SES.
 */

'use server';

interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  html: string;
}

/**
 * Sends an email.
 *
 * @param options The email options.
 * @returns A promise that resolves when the email is "sent".
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  console.log('--- SIMULATING EMAIL SEND ---');
  console.log(`To: ${options.to}`);
  console.log(`From: ${options.from}`);
  console.log(`Subject: ${options.subject}`);
  console.log('--- HTML Body ---');
  console.log(options.html);
  console.log('---------------------------');
  // In a real implementation, you would use a service like SendGrid, for example:
  // await sgMail.send(options);
  return Promise.resolve();
}
