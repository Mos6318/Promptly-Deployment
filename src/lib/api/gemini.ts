import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ChatMessage, ChatResponse } from './types';

// Helper for delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function sendMessageToGemini(
    messages: ChatMessage[],
    apiKey: string
): Promise<ChatResponse> {
    const genAI = new GoogleGenerativeAI(apiKey);

    let systemInstruction: string | undefined;
    let conversationMessages = [...messages];

    // Extract System Prompt
    if (conversationMessages.length > 0 && conversationMessages[0].role === 'assistant') {
        systemInstruction = conversationMessages[0].content;
        conversationMessages.shift();
    }

    if (conversationMessages.length === 0) {
        return {
            content: '',
            provider: 'gemini',
            error: 'No user message found to send.'
        };
    }

    // STRICTLY use Gemini 2.0 Flash as requested and verified (partially)
    const modelName = 'gemini-2.0-flash';

    // Retry configuration
    const maxRetries = 2; // Keep it simple, 2 retries
    let attempts = 0;

    while (attempts <= maxRetries) {
        try {
            attempts++;

            // Native system instruction support
            const model = genAI.getGenerativeModel({
                model: modelName,
                systemInstruction: systemInstruction
            });

            // Prepare history
            let historyMessages = conversationMessages.slice(0, -1);
            const lastMessage = conversationMessages[conversationMessages.length - 1];

            // Validate history (User start)
            while (historyMessages.length > 0 && historyMessages[0].role !== 'user') {
                historyMessages.shift();
            }

            const chat = model.startChat({
                history: historyMessages.map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }],
                })),
            });

            const result = await chat.sendMessage(lastMessage.content);
            const response = await result.response;

            return {
                content: response.text(),
                provider: 'gemini',
            };

        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            console.warn(`Model ${modelName} attempt ${attempts} failed: ${errorMsg}`);

            // Check for Rate Limit signals
            if (errorMsg.includes('429')) {
                // If "limit: 0" is present, it's likely a Billing Issue, not just temporary congestion
                if (errorMsg.includes('limit: 0')) {
                    return {
                        content: '',
                        provider: 'gemini',
                        error: `Quota Error (Limit 0). You likely need to LINK A BILLING ACCOUNT to your Google Cloud Project to unlock the Free Tier for Gemini 2.0 Flash.`
                    };
                }

                if (attempts <= maxRetries) {
                    await delay(5000 * attempts); // 5s, 10s wait
                    continue;
                }
            }

            return {
                content: '',
                provider: 'gemini',
                error: `Gemini Error: ${errorMsg}`
            };
        }
    }

    return {
        content: '',
        provider: 'gemini',
        error: `Failed to connect to ${modelName} after multiple attempts.`
    };
}
