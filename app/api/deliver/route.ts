import { NextResponse } from 'next/server';
import { generateSlideImage } from '@/lib/image-generator';
import { sendCarouselEmail } from '@/lib/resend';
import archiver from 'archiver';
import { Slide } from '@/types';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { slides, email, forceVerified, customImage, firstName, lastName, handle } = await req.json();

        if (!slides || !email) {
            return NextResponse.json({ error: 'Missing slides or email' }, { status: 400 });
        }

        const userData = {
            id: user.id,
            clerkId: user.id,
            email: user.emailAddresses[0]?.emailAddress || "",
            name: `${firstName} ${lastName}`.trim() || user.username || "User",
            firstName,
            lastName,
            handle,
            imageUrl: user.imageUrl,
            customImageUrl: customImage || undefined,
            forceVerified: forceVerified || false
        };

        // 1. Generate Images
        const imageBuffers = await Promise.all(
            slides.map((s: Slide, i: number) => generateSlideImage(s, i, userData, slides.length))
        );

        // 2. Create ZIP
        const archive = archiver('zip', { zlib: { level: 9 } });
        const chunks: Buffer[] = [];

        archive.on('data', (chunk) => chunks.push(chunk));

        await new Promise<void>((resolve, reject) => {
            archive.on('end', resolve);
            archive.on('error', reject);

            imageBuffers.forEach((buf, i) => {
                archive.append(buf, { name: `slide-${i + 1}.png` });
            });

            archive.finalize();
        });

        const zipBuffer = Buffer.concat(chunks);

        // 3. Send Email with Attachment (No S3/Supabase needed)
        await sendCarouselEmail(email, zipBuffer);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Delivery error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
