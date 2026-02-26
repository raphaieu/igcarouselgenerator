"use client";

import { Slide } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Image as ImageIcon, Sparkles, X, Upload, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { toast } from "sonner";

interface EditableCardProps {
    slide: Slide;
    index: number;
    onUpdate: (id: string, updates: Partial<Slide>) => void;
    onRemove: (id: string) => void;
}

export function EditableCard({ slide, index, onUpdate, onRemove }: EditableCardProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image too large. Max 5MB.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            onUpdate(slide.id, { image: event.target?.result as string, file });
        };
        reader.readAsDataURL(file);
    };

    return (
        <Card className="relative overflow-hidden border-neutral-200">
            <div className="absolute right-2 top-2 z-10">
                <Button variant="ghost" size="icon" onClick={() => onRemove(slide.id)} className="h-6 w-6 text-neutral-400 hover:text-red-500">
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <CardHeader className="bg-neutral-50 px-4 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Slide {index + 1}
            </CardHeader>

            <CardContent className="space-y-4 p-4 pb-2">
                {/* Text Area (Primary) */}
                <Textarea
                    placeholder="Escreva seu texto aqui..."
                    className="min-h-[120px] resize-none border-none bg-transparent p-0 text-lg focus-visible:ring-0 shadow-none"
                    value={slide.content}
                    onChange={(e) => onUpdate(slide.id, { content: e.target.value })}
                />

                {/* Media Attachment Area */}
                {slide.image && (
                    <div className="relative mt-2 aspect-video w-full overflow-hidden rounded-md border border-neutral-100">
                        <Image
                            src={slide.image}
                            alt="Slide visual"
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                />
            </CardContent>

            <CardFooter className="bg-neutral-50/50 px-4 py-2 flex items-center justify-between min-h-[44px]">
                {slide.image ? (
                    <div className="flex items-center gap-2 w-full justify-between">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-neutral-500 hover:text-blue-500 hover:bg-blue-50"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="mr-2 h-4 w-4" /> Mudar Imagem
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => onUpdate(slide.id, { image: undefined, file: undefined })}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-neutral-500 hover:text-blue-500 hover:bg-blue-50"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <ImageIcon className="mr-2 h-4 w-4" /> Adicionar Imagem
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
