'use server';

import { generateBookingConfirmationEmail } from '@/ai/flows/send-booking-confirmation-flow';
import type { BookingConfirmationInput } from '@/ai/flows/types';
import { sendEmail } from '@/services/email';

export async function handleBookingConfirmation(userEmail: string, bookingDetails: BookingConfirmationInput) {
    if (!userEmail) {
        console.error("No user email provided for booking confirmation.");
        return;
    }

    try {
        // 1. Generate the email content using the AI flow
        const emailContent = await generateBookingConfirmationEmail(bookingDetails);

        // 2. Send the email using the email service
        await sendEmail({
            to: userEmail,
            from: 'kamales1123@gmail.com', // As specified
            subject: emailContent.subject,
            html: emailContent.body,
        });

        console.log(`Booking confirmation email generation and sending process initiated for ${userEmail}`);

    } catch (error) {
        console.error("Error handling booking confirmation:", error);
        // Optionally, you could add more robust error handling here,
        // like logging to a dedicated service or retrying.
    }
}
