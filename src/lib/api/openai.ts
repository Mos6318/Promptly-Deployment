import OpenAI from 'openai';
import type { ChatMessage, ChatResponse } from './types';

export async function sendMessageToOpenAI(
    messages: ChatMessage[],
    apiKey: string
): Promise<ChatResponse> {
    try {
        const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // Using gpt-3.5-turbo as it's more widely available and cheaper
            messages: messages.map(msg => ({
                role: msg.role,
                content: msg.content,
            })),
        });

        return {
            content: completion.choices[0]?.message?.content || '',
            provider: 'openai',
        };
    } catch (error) {
        return {
            content: '',
            provider: 'openai',
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
}
