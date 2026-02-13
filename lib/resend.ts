import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendCarouselEmail = async (email: string, downloadUrl: string) => {
    try {
        const data = await resend.emails.send({
            from: 'CarouselGen <onboarding@resend.dev>',
            to: [email],
            subject: 'Your Carousel is Ready! 🎠',
            html: `
        <h1>Your carousel has been generated!</h1>
        <p>Click the link below to download your images:</p>
        <a href="${downloadUrl}">Download ZIP</a>
        <p>Link expires in 7 days.</p>
        <p>Thanks for using CarouselGen!</p>
      `,
        });
        return { success: true, data };
    } catch (error) {
        return { success: false, error };
    }
};
