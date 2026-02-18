"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EditableCard } from "@/components/EditableCard";
import { PreviewCarousel } from "@/components/PreviewCarousel";
import { PaymentDialog } from "@/components/PaymentDialog";
import { Slide } from "@/types";
import { Sparkles, Download, ArrowRight, LayoutTemplate } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export default function Dashboard() {
    const { user } = useUser();
    const [topic, setTopic] = useState("");
    const [slides, setSlides] = useState<Slide[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPayment, setShowPayment] = useState(false);

    const handleGenerate = async () => {
        if (!topic.trim()) return toast.error("Por favor, insira um tópico");

        setIsGenerating(true);
        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                body: JSON.stringify({ topic }),
            });

            if (!response.ok) throw new Error("Falha ao gerar");

            const data = await response.json();
            setSlides(data.slides.map((s: any) => ({ ...s, id: uuidv4() })));
            toast.success("Carrossel gerado!");
        } catch (error) {
            toast.error("Algo deu errado. Tente novamente.");
        } finally {
            setIsGenerating(false);
        }
    };

    const updateSlide = (id: string, updates: Partial<Slide>) => {
        setSlides(slides.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const removeSlide = (id: string) => {
        setSlides(slides.filter(s => s.id !== id));
    };

    const handlePaymentSuccess = async (email: string) => {
        // Call API to generate ZIP
        toast.info("Gerando seu carrossel... por favor aguarde.");

        try {
            const response = await fetch('/api/deliver', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slides, email })
            });

            if (!response.ok) throw new Error("Falha na entrega");

            toast.success(`Enviado! Verifique seu email em ${email}`);
            setShowPayment(false);
        } catch (error) {
            toast.error("Falha ao processar a entrega. Tente novamente.");
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 pb-20">
            {/* Header */}
            <header className="sticky top-0 z-20 border-b bg-white/80 px-6 py-4 backdrop-blur-md">
                <div className="mx-auto flex max-w-5xl items-center justify-between">
                    <div className="flex items-center gap-2">
                        <LayoutTemplate className="h-6 w-6" />
                        <span className="font-bold text-lg hidden sm:inline-block">CarouselGen</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-neutral-500 hidden sm:inline-block">
                            {user?.fullName || user?.firstName}
                        </span>
                        <Button
                            disabled={slides.length === 0}
                            onClick={() => setShowPayment(true)}
                            className="rounded-full shadow-lg shadow-blue-500/20"
                        >
                            Exportar <Download className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 pt-8">
                {/* Input Section */}
                <section className="mb-12 space-y-4 text-center">
                    <h2 className="text-2xl font-bold tracking-tight">Qual conteúdo quer gerar / repassar?</h2>
                    <div className="mx-auto max-w-2xl relative">
                        <Textarea
                            placeholder="Ex: 5 dicas para dormir melhor, Como começar a programar..."
                            className="resize-none rounded-2xl border-neutral-200 p-4 text-lg shadow-sm focus-visible:ring-black min-h-[120px]"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                        <div className="absolute bottom-3 right-3">
                            <Button
                                onClick={handleGenerate}
                                className="rounded-xl"
                                disabled={isGenerating || !topic}
                            >
                                {isGenerating ? "Gerando..." : "Gerar com IA"}
                                <Sparkles className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Editor & Preview Split */}
                {slides.length > 0 && (
                    <div className="grid gap-12 lg:grid-cols-[1fr_340px]">
                        {/* Left: Editor */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold">Editar Slides</h3>
                                <span className="text-sm text-neutral-400">{slides.length} slides</span>
                            </div>

                            <div className="space-y-6">
                                {slides.map((slide, index) => (
                                    <EditableCard
                                        key={slide.id}
                                        slide={slide}
                                        index={index}
                                        onUpdate={updateSlide}
                                        onRemove={removeSlide}
                                    />
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                className="w-full border-dashed p-8 text-neutral-400 hover:border-neutral-400 hover:text-neutral-600"
                                onClick={() => setSlides([...slides, { id: uuidv4(), title: "", content: "" }])}
                            >
                                + Adicionar Slide
                            </Button>
                        </div>

                        {/* Right: Preview (Sticky) */}
                        <div className="hidden lg:block">
                            <div className="sticky top-24 space-y-4">
                                <h3 className="text-xl font-semibold">Preview Ao Vivo</h3>
                                <div className="rounded-2xl border bg-neutral-900 p-4 shadow-2xl">
                                    <div className="mb-4 flex items-center gap-2 border-b border-neutral-800 pb-2">
                                        <div className="h-2 w-2 rounded-full bg-red-500" />
                                        <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                        <div className="h-2 w-2 rounded-full bg-green-500" />
                                        <span className="ml-2 text-xs font-mono text-neutral-500">Instagram</span>
                                    </div>
                                    <div className="overflow-hidden rounded-lg bg-white">
                                        <PreviewCarousel slides={slides} user={user ? {
                                            id: user.id,
                                            email: user.primaryEmailAddress?.emailAddress!,
                                            clerkId: user.id,
                                            name: user.fullName || "",
                                            imageUrl: user.imageUrl
                                        } : null} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile Preview (visible only on small screens) */}
                {slides.length > 0 && (
                    <div className="mt-12 lg:hidden">
                        <h3 className="mb-4 text-xl font-semibold">Preview</h3>
                        <PreviewCarousel slides={slides} user={user ? {
                            id: user.id,
                            email: user.primaryEmailAddress?.emailAddress!,
                            clerkId: user.id,
                            name: user.fullName || "",
                            imageUrl: user.imageUrl
                        } : null} />
                    </div>
                )}
            </main>

            <PaymentDialog
                open={showPayment}
                onOpenChange={setShowPayment}
                onSuccess={handlePaymentSuccess}
            />
        </div>
    );
}
