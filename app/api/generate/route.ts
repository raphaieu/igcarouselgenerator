import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { topic } = await req.json();

    // Mock AI response
    // In v2: Call OpenAI/Anthropic here
    const slides = [
        { title: "Intro", content: `Here are 5 secrets about ${topic} that nobody tells you.` },
        { title: "Point 1", content: "1. Consistency is key. You can't just do it once and expect results." },
        { title: "Point 2", content: "2. Focus on quality over quantity. Better to have 1 great thing than 10 mediocre ones." },
        { title: "Point 3", content: "3. Engage with your audience. Ask questions and reply to comments." },
        { title: "Point 4", content: "4. Analyze your data. See what works and what doesn't." },
        { title: "Point 5", content: "5. Have fun! If you're not enjoying it, it will show." },
        { title: "Outro", content: "Did you find this helpful? Save this post for later! 📌" },
    ];

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json({ slides });
}
