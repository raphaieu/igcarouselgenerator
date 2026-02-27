import { Button } from "@/components/ui/button";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="flex items-center justify-center overflow-hidden">
        <video
          src="https://ckao.in/carouselgen-logo.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        />
      </div>
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
        tabajara
      </h1>
      <p className="mb-8 max-w-md text-lg text-neutral-600">
        Crie carrosséis envolventes e minimalistas para o Instagram a partir de uma simples ideia.
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
        © 2026 CarouselGen. Desenvolvido por <a href="https://instagram.com/raphaieu" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-600 transition-colors">@raphaieu</a>
      </footer>
    </main>
  );
}
