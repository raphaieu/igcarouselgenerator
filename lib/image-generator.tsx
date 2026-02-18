import { ImageResponse } from 'next/og';
import { Slide, User } from '@/types';

// We need to load a font for Satori to work properly.
export const runtime = 'edge';

// We'll fetch Inter from Google Fonts for consistency.
const interRegular = fetch(
    new URL('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff', import.meta.url)
).then((res) => res.arrayBuffer());

const interBold = fetch(
    new URL('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hjp-Ek-_EeA.woff', import.meta.url)
).then((res) => res.arrayBuffer());

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateSlideImage(slide: Slide, index: number, user: User, totalSlides: number): Promise<Buffer> {
    // Await fonts
    const [interRegData, interBoldData] = await Promise.all([interRegular, interBold]);

    const width = 1080;
    const height = 1350; // Instagram 4:5

    const element = (
        <div
            style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'white',
                padding: '80px',
                justifyContent: 'space-between',
                fontFamily: '"Inter"',
            }}
        >
            {/* Header: User Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                {user.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={user.imageUrl}
                        width="100"
                        height="100"
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                        alt="User Avatar"
                    />
                ) : (
                    <div
                        style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            backgroundColor: '#e5e5e5',
                        }}
                    />
                )}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '42px', fontWeight: 700, color: '#171717' }}>
                        {user.name || "User"}
                    </span>
                    <span style={{ fontSize: '32px', color: '#737373' }}>
                        @{user.name?.toLowerCase().replace(/\s+/g, '') || "handle"}
                    </span>
                </div>
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '40px' }}>
                <div style={{
                    fontSize: slide.content.length < 100 ? '68px' : '52px',
                    fontWeight: 500,
                    color: '#171717',
                    lineHeight: 1.4,
                    whiteSpace: 'pre-wrap',
                }}>
                    {slide.content}
                </div>

                {/* Optional Image */}
                {slide.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={slide.image}
                        style={{
                            width: '100%',
                            height: '500px',
                            objectFit: 'cover',
                            borderRadius: '24px',
                            border: '2px solid #f5f5f5',
                        }}
                        alt="Slide Image"
                    />
                )}
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '2px solid #f5f5f5', paddingTop: '40px' }}>
                {/* Pagination Dots */}
                <div style={{ display: 'flex', gap: '16px' }}>
                    {Array.from({ length: totalSlides }).map((_, i) => (
                        <div
                            key={i}
                            style={{
                                width: i === index ? '48px' : '24px',
                                height: '24px',
                                borderRadius: '12px',
                                backgroundColor: i === index ? '#3b82f6' : '#e5e5e5',
                            }}
                        />
                    ))}
                </div>

                {/* Counter */}
                <span style={{ fontSize: '32px', fontWeight: 500, color: '#a3a3a3' }}>
                    {index + 1} / {totalSlides}
                </span>
            </div>
        </div>
    );

    const imageResponse = new ImageResponse(element, {
        width,
        height,
        fonts: [
            {
                name: 'Inter',
                data: interRegData,
                style: 'normal',
                weight: 400,
            },
            {
                name: 'Inter',
                data: interBoldData,
                style: 'normal',
                weight: 700,
            },
        ],
    });

    const arrayBuffer = await imageResponse.arrayBuffer();
    return Buffer.from(arrayBuffer);
}
