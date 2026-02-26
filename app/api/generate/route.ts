import { NextResponse } from 'next/server';
import { generateCarousel } from '@/lib/ai';

export async function POST(req: Request) {
    try {
        const { topic } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: "O tópico é obrigatório" }, { status: 400 });
        }

        const slides = await generateCarousel(topic);

        return NextResponse.json({ slides });
    } catch (error) {
        console.error("API Generate Error:", error);
        return NextResponse.json(
            { error: "Erro ao gerar carrossel com IA" },
            { status: 500 }
        );
    }
}
