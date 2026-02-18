import { Button } from "@/components/ui/button";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white shadow-xl">
        <Sparkles className="h-8 w-8" />
      </div>

      <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
        CarouselGen
      </h1>

      <p className="mb-8 max-w-md text-lg text-neutral-600">
        Crie carrosséis envolventes e minimalistas para o Instagram a partir de uma simples ideia.
        Alimentado por IA. Mobile-first.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <SignedOut>
          <SignInButton mode="modal">
            <Button size="lg" className="gap-2 rounded-full px-8 text-base font-medium">
              Começar Agora <ArrowRight className="h-4 w-4" />
            </Button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 rounded-full px-8 text-base font-medium">
              Ir para o Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </SignedIn>
      </div>

      <footer className="absolute bottom-6 text-sm text-neutral-400">
        © 2026 CarouselGen. Desenvolvido por @raphaieu
      </footer>
    </main>
  );
}
