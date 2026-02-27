"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { EditableCard } from "@/components/EditableCard";
import { PreviewCarousel } from "@/components/PreviewCarousel";
import { PaymentDialog } from "@/components/PaymentDialog";
import { Slide } from "@/types";
import { Sparkles, Download, ArrowRight, LayoutTemplate, Camera, Pencil, Trash2, X as XIcon, UserCircle, AtSign, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

export default function Dashboard() {
    const { user, isLoaded } = useUser();
    const [topic, setTopic] = useState("");
    const [slides, setSlides] = useState<Slide[]>([
        { id: uuidv4(), title: "Intro", content: "" }
    ]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [forceVerified, setForceVerified] = useState(false);
    const [customImage, setCustomImage] = useState<string | null>(null);

    // Profile State
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [handle, setHandle] = useState("");
    const [isHandleCustom, setIsHandleCustom] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isIdentityOpen, setIsIdentityOpen] = useState(false);

    const profileInputRef = useRef<HTMLInputElement>(null);

    // Initialize profile from Clerk
    useEffect(() => {
        if (isLoaded && user) {
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
            const savedHandle = (user.unsafeMetadata?.handle as string) || user.username || "";
            setHandle(savedHandle);
            if (savedHandle) setIsHandleCustom(true);
        }
    }, [isLoaded, user]);

    // Auto-generate handle
    useEffect(() => {
        if (!isHandleCustom && (firstName || lastName)) {
            const suggestedHandle = `${firstName}${lastName}`.toLowerCase().replace(/\s+/g, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            setHandle(suggestedHandle);
        }
    }, [firstName, lastName, isHandleCustom]);

    const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) return toast.error("Imagem muito grande. Máximo 2MB.");

        // Show preview immediately
        const reader = new FileReader();
        reader.onload = (event) => setCustomImage(event.target?.result as string);
        reader.readAsDataURL(file);

        // Sync with Clerk
        try {
            await user?.setProfileImage({ file });
            toast.success("Foto de perfil atualizada!");
        } catch (err) {
            console.error(err);
            toast.error("Erro ao sincronizar foto com Clerk.");
        }
    };

    const saveProfileToClerk = async () => {
        if (!user) return;
        setIsSavingProfile(true);
        try {
            await user.update({
                firstName,
                lastName,
                unsafeMetadata: {
                    ...user.unsafeMetadata,
                    handle: handle
                }
            });
            toast.success("Perfil sincronizado com Clerk!");
        } catch (err: any) {
            console.error(err);
            toast.error(err.errors?.[0]?.message || "Erro ao salvar perfil.");
        } finally {
            setIsSavingProfile(false);
        }
    };

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
                body: JSON.stringify({
                    slides,
                    email,
                    forceVerified,
                    customImage,
                    firstName,
                    lastName,
                    handle
                })
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
                        <Image src="/favico.png" alt="Logo" width={38} height={38} className="rounded-md" />
                        <span className="font-bold text-lg hidden sm:inline-block">CarouselGen</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            disabled={slides.length === 0 || slides[0].content.length === 0}
                            onClick={() => setShowPayment(true)}
                            className="rounded-full shadow-lg shadow-blue-500/20"
                        >
                            Exportar <Download className="ml-2 h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-2 group relative">
                            <input
                                type="file"
                                ref={profileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleProfileImageUpload}
                            />
                            <div
                                className="relative h-10 w-10 cursor-pointer overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 transition-all hover:ring-2 hover:ring-blue-500/20 shrink-0"
                                onClick={() => profileInputRef.current?.click()}
                            >
                                {customImage || user?.imageUrl ? (
                                    <Image
                                        src={customImage || user?.imageUrl!}
                                        alt="Profile"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-neutral-400">
                                        <Camera className="h-4 w-4" />
                                    </div>
                                )}

                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                    {customImage ? <XIcon className="h-4 w-4 text-white" /> : <Pencil className="h-4 w-4 text-white" />}
                                </div>
                            </div>

                            {customImage && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCustomImage(null);
                                    }}
                                    className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white shadow-sm hover:bg-red-600 cursor-pointer z-10"
                                >
                                    <XIcon className="h-2.5 w-2.5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 pt-8">
                {/* Input Section */}
                <section className="mb-12 space-y-6 text-center">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight">Qual conteúdo quer gerar / repassar?</h2>
                        <p className="text-sm text-neutral-500">Insira sua ideia ou texto para que a IA crie os slides.</p>
                    </div>

                    <div className="mx-auto max-w-2xl space-y-4">
                        <div className="relative">
                            <Textarea
                                placeholder="Ex: 5 dicas para dormir melhor, Como começar a programar..."
                                className="resize-none rounded-2xl border-neutral-200 p-4 text-lg shadow-sm focus-visible:ring-black min-h-[140px]"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            />
                            <div className="absolute bottom-3 right-3">
                                <Button
                                    onClick={handleGenerate}
                                    className="rounded-xl shadow-lg shadow-black/5"
                                    disabled={isGenerating || !topic}
                                >
                                    {isGenerating ? "Gerando..." : "Gerar com IA"}
                                    <Sparkles className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Profile Customization Area (Accordion) */}
                        <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-sm transition-all duration-200">
                            <button
                                onClick={() => setIsIdentityOpen(!isIdentityOpen)}
                                className="cursor-pointer w-full flex items-center justify-between p-4 hover:bg-neutral-50/50 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <UserCircle className="h-5 w-5 text-neutral-400" />
                                    <h3 className="font-semibold text-neutral-700 font-sans">Identidade no Carrossel</h3>
                                </div>
                                <ChevronDown className={`h-4 w-4 text-neutral-400 transition-transform duration-200 ${isIdentityOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <div className={`grid gap-6 overflow-hidden transition-all duration-300 ease-in-out ${isIdentityOpen ? 'max-h-[500px] p-6 pt-0 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-neutral-100 pt-6">
                                    <div className="flex items-center gap-4">
                                        <label
                                            htmlFor="force-verified"
                                            className="text-xs font-medium text-neutral-500 cursor-pointer select-none flex items-center gap-1.5"
                                        >
                                            <div className="flex items-center gap-1">
                                                Forçar Verificado
                                                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-blue-500">
                                                    <g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.02-2.147 3.6 0 1.435.716 2.69 1.77 3.46-.254.55-.38 1.155-.37 1.78.04 1.968 1.528 3.633 3.48 3.895.532.88 1.5 1.465 2.624 1.465.73 0 1.41-.35 1.95-.91.737.906 1.83 1.41 2.99 1.41.97 0 1.89-.35 2.62-1.07.61.27 1.29.41 1.98.41 1.258 0 2.394-.53 3.2-1.385.344-.365.63-.77.84-1.21 1.63-.61 2.8-2.19 2.8-4.05zm-9.35 4.35l-3.8-3.92 1.47-1.44 2.35 2.4 4.58-5.32 1.5 1.28-6.1 7z"></path></g>
                                                </svg>
                                            </div>
                                            <input
                                                id="force-verified"
                                                type="checkbox"
                                                checked={forceVerified}
                                                onChange={(e) => setForceVerified(e.target.checked)}
                                                className="h-4 w-4 accent-blue-500 rounded border-neutral-300 transition-all cursor-pointer"
                                            />
                                        </label>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 text-xs bg-neutral-50 px-4"
                                        onClick={saveProfileToClerk}
                                        disabled={isSavingProfile}
                                    >
                                        {isSavingProfile ? "Sincronizando..." : "Sincronizar"}
                                    </Button>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase text-neutral-400 px-1 text-left block">Nome</label>
                                        <Input
                                            placeholder="Nome"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="h-9 rounded-lg border-neutral-200 bg-neutral-50/50"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase text-neutral-400 px-1 text-left block">Sobrenome</label>
                                        <Input
                                            placeholder="Sobrenome"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="h-9 rounded-lg border-neutral-200 bg-neutral-50/50"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase text-neutral-400 px-1 text-left block">Handle</label>
                                        <div className="relative">
                                            <Input
                                                placeholder="handle"
                                                value={handle}
                                                onChange={(e) => {
                                                    setHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''));
                                                    setIsHandleCustom(true);
                                                }}
                                                className="h-9 rounded-lg border-neutral-200 bg-neutral-50/50 pl-7"
                                            />
                                            <AtSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Editor & Preview Split */}
                {slides.length > 0 && (
                    <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
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
                                            name: `${firstName} ${lastName}`.trim() || user.username || "User",
                                            firstName,
                                            lastName,
                                            handle,
                                            imageUrl: user.imageUrl,
                                            customImageUrl: customImage || undefined,
                                            forceVerified: forceVerified
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
                            name: `${firstName} ${lastName}`.trim() || user.username || "User",
                            firstName,
                            lastName,
                            handle,
                            imageUrl: user.imageUrl,
                            customImageUrl: customImage || undefined,
                            forceVerified: forceVerified
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
