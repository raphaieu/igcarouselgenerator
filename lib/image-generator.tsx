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
                        src={user.customImageUrl || user.imageUrl || ""}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '42px', fontWeight: 700, color: '#171717' }}>
                            {user.name || "User"}
                        </span>
                        {(user.isVerified || user.forceVerified) && (
                            <svg viewBox="0 0 24 24" style={{ width: '32px', height: '32px' }}>
                                <g><path fill="#3b82f6" d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.02-2.147 3.6 0 1.435.716 2.69 1.77 3.46-.254.55-.38 1.155-.37 1.78.04 1.968 1.528 3.633 3.48 3.895.532.88 1.5 1.465 2.624 1.465.73 0 1.41-.35 1.95-.91.737.906 1.83 1.41 2.99 1.41.97 0 1.89-.35 2.62-1.07.61.27 1.29.41 1.98.41 1.258 0 2.394-.53 3.2-1.385.344-.365.63-.77.84-1.21 1.63-.61 2.8-2.19 2.8-4.05zm-9.35 4.35l-3.8-3.92 1.47-1.44 2.35 2.4 4.58-5.32 1.5 1.28-6.1 7z"></path></g>
                            </svg>
                        )}
                    </div>
                    <span style={{ fontSize: '32px', color: '#737373' }}>
                        @{user.name?.toLowerCase().replace(/\s+/g, '').replace('null', '') || "handle"}
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
