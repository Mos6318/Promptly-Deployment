import { create } from 'zustand';

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export interface AttachedFile {
    id: string;
    name: string;
    type: string;
    size: number;
    preview?: string; // base64 for images
    content?: string; // extracted text for PDFs
}

export interface ConversationState {
    stage: 'idle' | 'ask_llm' | 'ask_task' | 'select_technique' | 'gather_sections' | 'confirm' | 'generated';
    selectedLLM?: string;
    taskDescription?: string;
    selectedTechnique?: string;
    currentSectionIndex: number;
    currentSection: string | null; // e.g., "task", "actor", "numberOfOutputs"
    sections: Record<string, string>;
    attachedFiles: AttachedFile[];
}

export interface ChatState {
    messages: ChatMessage[];
    conversationState: ConversationState;
    addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
    clearMessages: () => void;
    getConversationText: () => string;
    updateConversationState: (updates: Partial<ConversationState>) => void;
    resetConversationState: () => void;
    addFile: (file: AttachedFile) => void;
    removeFile: (fileId: string) => void;
    setCurrentSection: (section: string | null) => void;
}

const initialConversationState: ConversationState = {
    stage: 'idle',
    currentSectionIndex: 0,
    currentSection: null,
    sections: {},
    attachedFiles: [],
};

export const useChatStore = create<ChatState>((set, get) => ({
    messages: [],
    conversationState: initialConversationState,

    addMessage: (message) =>
        set((state) => ({
            messages: [
                ...state.messages,
                {
                    ...message,
                    id: Date.now().toString(),
                    timestamp: Date.now(),
                },
            ],
        })),

    clearMessages: () =>
        set({
            messages: [],
        }),

    getConversationText: () => {
        const { messages } = get();
        return messages
            .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
            .join('\n\n');
    },

    updateConversationState: (updates) =>
        set((state) => ({
            conversationState: {
                ...state.conversationState,
                ...updates,
            },
        })),

    resetConversationState: () =>
        set({
            conversationState: initialConversationState,
        }),

    addFile: (file) =>
        set((state) => ({
            conversationState: {
                ...state.conversationState,
                attachedFiles: [...state.conversationState.attachedFiles, file],
            },
        })),

    removeFile: (fileId) =>
        set((state) => ({
            conversationState: {
                ...state.conversationState,
                attachedFiles: state.conversationState.attachedFiles.filter(f => f.id !== fileId),
            },
        })),

    setCurrentSection: (section) =>
        set((state) => ({
            conversationState: {
                ...state.conversationState,
                currentSection: section,
            },
        })),
}));
