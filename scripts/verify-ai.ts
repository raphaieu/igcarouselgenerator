import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runTests() {
    console.log("🚀 Starting AI Carousel Generation Tests...\n");

    // Dynamic import after env vars are loaded
    const { generateCarousel } = await import('../lib/ai');

    const tests = [
        {
            name: "Raw Idea Test",
            topic: "5 dicas para economizar dinheiro sendo estagiário"
        },
        {
            name: "Long Text Test",
            topic: "O futuro da inteligência artificial generativa está cada vez mais focado em agentes autônomos. Diferente dos chatbots tradicionais, os agentes podem executar tarefas complexas, interagir com ferramentas externas e tomar decisões baseadas em objetivos de alto nível. Isso muda radicalmente como interagimos com software, passando de comandos diretos para colaboração estratégica."
        }
    ];

    for (const test of tests) {
        console.log(`--- Testing: ${test.name} ---`);
        console.log(`Input: ${test.topic.substring(0, 50)}...`);

        try {
            const slides = await generateCarousel(test.topic);
            console.log(`✅ Success! Generated ${slides.length} slides.`);
            console.log("First Slide Hook:", slides[0].content);
            console.log("Last Slide CTA:", slides[slides.length - 1].content);
            console.log("\n");
        } catch (error) {
            console.error(`❌ Failed: ${test.name}`, error);
        }
    }
}

runTests();
