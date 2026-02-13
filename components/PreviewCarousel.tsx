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
                Start by generating some slides!
            </div>
        );
    }

    return (
        <div className="w-full">
            <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex w-max space-x-4 p-4">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className="relative aspect-[4/5] w-[280px] shrink-0 overflow-hidden rounded-xl bg-white shadow-lg border border-neutral-100 flex flex-col"
                        >
                            {/* Image Section */}
                            <div className="relative h-1/2 w-full bg-neutral-100">
                                {slide.image ? (
                                    <img src={slide.image} alt={`Slide ${index}`} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full items-center justify-center bg-neutral-50 text-neutral-300">
                                        No Image
                                    </div>
                                )}
                                {/* Watermark */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="text-xl font-bold text-white/30 -rotate-45 select-none">@raphaieu</span>
                                </div>
                            </div>

                            {/* Text Section */}
                            <div className="flex-1 p-5 flex flex-col justify-between whitespace-normal">
                                <p className="text-sm font-medium leading-relaxed text-neutral-800">
                                    {slide.content || "Add some text..."}
                                </p>

                                {/* Footer */}
                                <div className="mt-4 flex items-center gap-2 border-t pt-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user?.imageUrl} />
                                        <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col text-xs">
                                        <span className="font-bold text-neutral-900">{user?.name || "Your Name"}</span>
                                        <span className="text-neutral-500">@raphaieu</span>
                                    </div>
                                </div>
                            </div>

                            {/* Pagination Dots */}
                            <div className="absolute top-3 right-3 rounded-full bg-black/50 px-2 py-1 text-[10px] text-white">
                                {index + 1}/{slides.length}
                            </div>
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}
