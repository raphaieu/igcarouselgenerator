import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { topic } = await req.json();

    // Mock AI response
    // In v2: Call OpenAI/Anthropic here
    const slides = [
        { title: "Intro", content: `Aqui estão 5 segredos sobre ${topic} que ninguém te conta.` },
        { title: "Ponto 1", content: "1. Consistência é a chave. Você não pode fazer apenas uma vez e esperar resultados." },
        { title: "Ponto 2", content: "2. Foque na qualidade sobre a quantidade. É melhor ter 1 coisa ótima do que 10 medíocres." },
        { title: "Ponto 3", content: "3. Engaje com sua audiência. Faça perguntas e responda aos comentários." },
        { title: "Ponto 4", content: "4. Analise seus dados. Veja o que funciona e o que não funciona." },
        { title: "Ponto 5", content: "5. Divirta-se! Se você não está gostando, isso vai transparecer." },
        { title: "Outro", content: "Achou isso útil? Salve este post para depois! 📌" },
    ];

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json({ slides });
}
