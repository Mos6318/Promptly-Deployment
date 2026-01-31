import Anthropic from '@anthropic-ai/sdk';
import type { ChatMessage, ChatResponse } from './types';

export async function sendMessageToClaude(
    messages: ChatMessage[],
    apiKey: string
): Promise<ChatResponse> {
    try {
        const anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514', // Latest Claude Sonnet 4 model from Anthropic
            max_tokens: 1024,
            messages: messages.map(msg => ({
                role: msg.role,
                content: msg.content,
            })),
        });

        const content = response.content[0];
        return {
            content: content.type === 'text' ? content.text : '',
            provider: 'claude',
        };
    } catch (error) {
        return {
            content: '',
            provider: 'claude',
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
}
