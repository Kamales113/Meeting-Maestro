'use server';
/**
 * @fileOverview A flow to generate a booking confirmation email.
 *
 * - generateBookingConfirmationEmail - A function that generates the email content.
 */

import {ai} from '@/ai/genkit';
import { BookingConfirmationInputSchema, BookingConfirmationOutputSchema, type BookingConfirmationInput, type BookingConfirmationOutput } from './types';


const prompt = ai.definePrompt({
  name: 'bookingConfirmationPrompt',
  input: {schema: BookingConfirmationInputSchema},
  output: {schema: BookingConfirmationOutputSchema},
  prompt: `
    You are an assistant for the "Meeting Maestro" application. Your task is to generate a professional and friendly meeting room booking confirmation email.

    The user, {{{userName}}}, has just booked a room. Generate an email with a clear subject and a concise HTML body.

    The email should include:
    - A clear subject line like "Booking Confirmed: [Meeting Title]".
    - A greeting to the user.
    - Confirmation that their booking is complete.
    - All the essential details: Meeting Title, Room Name, Date, and Time.
    - A professional closing.

    Here are the booking details:
    - User Name: {{{userName}}}
    - Meeting Title: {{{meetingTitle}}}
    - Room: {{{roomName}}}
    - Date: {{{bookingDate}}}
    - Start Time: {{{startTime}}}
    - End Time: {{{endTime}}}

    Generate the email content based on these details. The body content must be valid HTML.
  `,
});

const sendBookingConfirmationFlow = ai.defineFlow(
  {
    name: 'sendBookingConfirmationFlow',
    inputSchema: BookingConfirmationInputSchema,
    outputSchema: BookingConfirmationOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function generateBookingConfirmationEmail(input: BookingConfirmationInput): Promise<BookingConfirmationOutput> {
    return sendBookingConfirmationFlow(input);
}
