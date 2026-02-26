"use client";

import { Slide, User } from "@/types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PreviewCarouselProps {
    slides: Slide[];
    user: User | null;
}

export function PreviewCarousel({ slides, user }: PreviewCarouselProps) {
    if (slides.length === 0) {
        return (
            <div className="flex h-64 w-full items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 text-neutral-400">
                Comece gerando alguns slides!
            </div>
        );
    }

    return (
        <div className="w-full">
            <ScrollArea className="w-full whitespace-nowrap rounded-md pb-4">
                <div className="flex w-max space-x-6 p-4">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className="relative aspect-[4/5] w-[330px] shrink-0 overflow-hidden rounded-none bg-white shadow-xl border border-neutral-100 flex flex-col p-8 select-none"
                            style={{ fontFamily: 'Inter, sans-serif' }} // Enforcing a clean font if not globally set
                        >
                            {/* Header: User Info */}
                            <div className="flex items-center gap-3 mb-6">
                                <Avatar className="h-10 w-10 border border-neutral-100">
                                    <AvatarImage src={user?.customImageUrl || user?.imageUrl} />
                                    <AvatarFallback className="bg-neutral-100 text-neutral-500">{user?.name?.[0] || "U"}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col leading-tight">
                                    <div className="flex items-center gap-1">
                                        <span className="font-bold text-sm text-neutral-900">{user?.name || "Your Name"}</span>
                                        {(user?.isVerified || user?.forceVerified) && (
                                            <svg viewBox="0 0 24 24" aria-label="Verified account" className="h-3 w-3 fill-blue-500 text-blue-500">
                                                <g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.02-2.147 3.6 0 1.435.716 2.69 1.77 3.46-.254.55-.38 1.155-.37 1.78.04 1.968 1.528 3.633 3.48 3.895.532.88 1.5 1.465 2.624 1.465.73 0 1.41-.35 1.95-.91.737.906 1.83 1.41 2.99 1.41.97 0 1.89-.35 2.62-1.07.61.27 1.29.41 1.98.41 1.258 0 2.394-.53 3.2-1.385.344-.365.63-.77.84-1.21 1.63-.61 2.8-2.19 2.8-4.05zm-9.35 4.35l-3.8-3.92 1.47-1.44 2.35 2.4 4.58-5.32 1.5 1.28-6.1 7z"></path></g>
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-xs text-neutral-500 font-medium">@{user?.name?.toLowerCase().replace(/\s+/g, '').replace('null', '') || "handle"}</span>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 flex flex-col gap-4">
                                {/* Text Content */}
                                {slide.content && (
                                    <p className={`whitespace-pre-wrap font-medium text-neutral-900 leading-relaxed ${slide.content.length < 100 ? 'text-2xl' : 'text-lg'
                                        }`}>
                                        {slide.content}
                                    </p>
                                )}

                                {/* Optional Image */}
                                {slide.image && (
                                    <div className="relative mt-2 w-full overflow-hidden rounded-lg border border-neutral-100 shadow-sm">
                                        <img
                                            src={slide.image}
                                            alt="Slide attachment"
                                            className="w-full h-auto object-cover max-h-[220px]"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Footer / Pagination */}
                            <div className="mt-8 flex items-center justify-between border-t border-neutral-100 pt-4">
                                <div className="flex gap-1">
                                    {/* Pagination Dots (Contextual) */}
                                    {slides.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-1.5 w-1.5 rounded-full ${i === index ? 'bg-blue-500 w-3' : 'bg-neutral-200'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs font-medium text-neutral-400">
                                    {index + 1} / {slides.length}
                                </span>
                            </div>

                            {/* Navigation Arrows (Visual Enhancement for Preview) */}
                            {index < slides.length - 1 && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-100 p-2 text-neutral-400 opacity-50 hover:opacity-100 hidden group-hover:flex cursor-pointer transition-all active:scale-95">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}
