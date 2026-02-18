"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, CreditCard, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PaymentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: (email: string) => void;
}

export function PaymentDialog({ open, onOpenChange, onSuccess }: PaymentDialogProps) {
    const [step, setStep] = useState<"email" | "payment" | "success">("email");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setStep("payment");
    };

    const copyPix = () => {
        navigator.clipboard.writeText("00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-4266141740005204000053039865802BR5913CarouselGen6008Brasilia62070503***63041D3D");
        toast.success("Código PIX copiado!");
    };

    const handlePaymentCheck = async () => {
        setLoading(true);
        // Mock payment check
        setTimeout(() => {
            setLoading(false);
            setStep("success");
            onSuccess(email);
        }, 2000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Garanta seu Carrossel</DialogTitle>
                    <DialogDescription>
                        Imagens em alta qualidade, sem marca d'água, entregues no seu email.
                    </DialogDescription>
                </DialogHeader>

                {step === "email" && (
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Endereço de email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="w-full">
                                Continuar para Pagamento
                            </Button>
                        </DialogFooter>
                    </form>
                )}

                {step === "payment" && (
                    <div className="space-y-6">
                        <div className="flex flex-col items-center justify-center space-y-2 border rounded-lg p-6 bg-neutral-50">
                            <div className="h-40 w-40 bg-white border-2 border-dashed border-neutral-300 flex items-center justify-center text-neutral-400">
                                [MOCK DE QR CODE]
                            </div>
                            <p className="text-sm font-medium text-neutral-600">Escaneie para pagar com PIX</p>
                            <p className="text-2xl font-bold text-neutral-900">R$ 9,90</p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Input
                                value="00020126580014BR.GOV..."
                                readOnly
                                className="bg-neutral-100 font-mono text-xs text-neutral-500"
                            />
                            <Button size="icon" variant="outline" onClick={copyPix}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>

                        <DialogFooter>
                            <Button onClick={handlePaymentCheck} disabled={loading} className="w-full">
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
                                {loading ? "Verificando..." : "Já realizei o pagamento"}
                            </Button>
                        </DialogFooter>
                    </div>
                )}

                {step === "success" && (
                    <div className="flex flex-col items-center justify-center space-y-4 py-6">
                        <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-semibold">Pagamento Confirmado!</h3>
                        <p className="text-center text-neutral-500 text-sm px-4">
                            Estamos gerando suas imagens em alta qualidade. Você receberá um email em <strong>{email}</strong> em breve.
                        </p>
                        <Button onClick={() => onOpenChange(false)} variant="outline" className="mt-4">
                            Fechar
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
