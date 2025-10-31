import {z} from 'genkit';

export const BookingConfirmationInputSchema = z.object({
  roomName: z.string().describe('The name of the meeting room that was booked.'),
  startTime: z.string().describe('The start time of the booking in a readable format.'),
  endTime: z.string().describe('The end time of the booking in a readable format.'),
  bookingDate: z.string().describe('The date of the booking in a readable format.'),
  meetingTitle: z.string().describe('The title of the meeting.'),
  userName: z.string().describe('The name of the user who made the booking.'),
});
export type BookingConfirmationInput = z.infer<typeof BookingConfirmationInputSchema>;

export const BookingConfirmationOutputSchema = z.object({
  subject: z.string().describe('The subject line for the confirmation email.'),
  body: z.string().describe('The HTML body of the confirmation email.'),
});
export type BookingConfirmationOutput = z.infer<typeof BookingConfirmationOutputSchema>;
