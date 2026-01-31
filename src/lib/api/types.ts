// Unified Chat API Interface
export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatResponse {
    content: string;
    provider: string;
    error?: string;
}

export type ApiProvider = 'gemini' | 'openai' | 'claude';
