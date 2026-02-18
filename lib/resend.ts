import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendCarouselEmail = async (email: string, zipBuffer: Buffer) => {
    try {
        const data = await resend.emails.send({
            from: 'CarouselGen <onboarding@resend.dev>',
            to: [email],
            subject: 'Seu carrossel está pronto! 🎠',
            html: `
        <h1>Seu carrossel foi gerado!</h1>
        <p>O arquivo ZIP com suas imagens está anexado a este email.</p>
        <p>Obrigado por utilizar o CarouselGen!</p>
      `,
            attachments: [
                {
                    filename: 'carousel.zip',
                    content: zipBuffer,
                },
            ],
        });
        return { success: true, data };
    } catch (error) {
        console.error("Resend error:", error);
        return { success: false, error };
    }
};
