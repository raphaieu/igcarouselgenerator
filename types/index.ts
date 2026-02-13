export interface Slide {
    id: string;
    title: string;
    content: string;
    image?: string; // URL or base64
    file?: File; // For upload handling
}

export interface Generation {
    id: string;
    userId: string;
    email: string;
    status: 'pending' | 'paid' | 'completed';
    zipUrl?: string;
    createdAt: string;
    expiresAt: string;
}

export interface User {
    id: string;
    email: string;
    clerkId: string;
    name?: string;
    imageUrl?: string;
}
