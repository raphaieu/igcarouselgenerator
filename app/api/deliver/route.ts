import { NextResponse } from 'next/server';
import { generateSlideImage } from '@/lib/image-generator';
import { uploadToS3 } from '@/lib/s3';
import { sendCarouselEmail } from '@/lib/resend';
import archiver from 'archiver';
import { Slide } from '@/types';
import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { slides, email } = await req.json();

        if (!slides || !email) {
            return NextResponse.json({ error: 'Missing slides or email' }, { status: 400 });
        }

        // 1. Generate Images
        const imageBuffers = await Promise.all(
            slides.map((s: Slide, i: number) => generateSlideImage(s, i))
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

        // 3. Upload to S3
        const fileName = `temp/${userId}/${Date.now()}-carousel.zip`;
        const downloadUrl = await uploadToS3(zipBuffer, fileName, 'application/zip');

        // 4. Send Email
        await sendCarouselEmail(email, downloadUrl);

        // 5. Log to Supabase
        // Note: This might fail if the 'generations' table doesn't exist yet, 
        // but we proceed anyway for the MVP flow.
        await supabase.from('generations').insert({
            user_id: userId,
            email,
            zip_url: downloadUrl,
            status: 'completed'
        });

        return NextResponse.json({ success: true, downloadUrl });

    } catch (error) {
        console.error('Delivery error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
