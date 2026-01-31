import { sendMessageToGemini } from './gemini';
import { sendMessageToOpenAI } from './openai';
import { sendMessageToClaude } from './claude';
import type { ChatMessage, ChatResponse, ApiProvider } from './types';

export async function sendMessage(
    messages: ChatMessage[],
    provider: ApiProvider,
    apiKey: string
): Promise<ChatResponse> {
    switch (provider) {
        case 'gemini':
            return sendMessageToGemini(messages, apiKey);
        case 'openai':
            return sendMessageToOpenAI(messages, apiKey);
        case 'claude':
            return sendMessageToClaude(messages, apiKey);
        default:
            return {
                content: '',
                provider: 'unknown',
                error: 'Invalid provider specified',
            };
    }
}

export * from './types';
