import sharp from 'sharp';
import { Slide } from '@/types';

export async function generateSlideImage(slide: Slide, index: number): Promise<Buffer> {
    const width = 1080;
    const height = 1350; // Instagram Portrait 4:5
    const padding = 80;

    // Simple SVG template for the slide
    // We can't do complex text wrapping easily in pure SVG without foreignObject (which sharp supports but can be tricky with fonts)
    // For MVP: We will assume simple text.
    // Or we can use a basic helper to wrap text.

    const title = slide.title || `Slide ${index + 1}`;
    const content = slide.content.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Basic text wrapping logic for SVG
    const words = content.split(' ');
    let line = '';
    const lines: string[] = [];
    const charsPerLine = 25; // Approximate for font size

    words.forEach(word => {
        if ((line + word).length > charsPerLine) {
            lines.push(line);
            line = word + ' ';
        } else {
            line += word + ' ';
        }
    });
    lines.push(line);

    const textSvgLines = lines.map((l, i) =>
        `<text x="50%" y="${500 + (i * 60)}" font-size="48" font-family="sans-serif" text-anchor="middle" fill="#333">${l}</text>`
    ).join('\n');

    const svgImage = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="white"/>
      <text x="50%" y="200" font-size="64" font-family="sans-serif" font-weight="bold" text-anchor="middle" fill="black">${title}</text>
      ${textSvgLines}
      <text x="50%" y="${height - 100}" font-size="32" font-family="sans-serif" text-anchor="middle" fill="#999">@raphaieu</text>
    </svg>
  `;

    let baseImage = sharp(Buffer.from(svgImage));

    if (slide.image) {
        try {
            // If slide.image is data:image/..., strip prefix
            let imageBuffer: Buffer;
            if (slide.image.startsWith('data:')) {
                const parts = slide.image.split(',');
                imageBuffer = Buffer.from(parts[1], 'base64');
            } else {
                // Assume URL (not implemented for MVP/local images unless fetched)
                // For now, only base64 from FileReader works reliably without fetch
                console.warn('Remote URL images not fully supported in MVP generator yet');
                return baseImage.png().toBuffer();
            }

            // Resize user image to fit top half
            // We will place it at y=0, height=50% of 1350 = 675
            const resizedImage = await sharp(imageBuffer)
                .resize({ width: 1080, height: 675, fit: 'cover' })
                .toBuffer();

            // Composite
            baseImage = baseImage.composite([{ input: resizedImage, top: 0, left: 0 }]);
        } catch (e) {
            console.error('Failed to composite image', e);
        }
    }

    return baseImage.png().toBuffer();
}
