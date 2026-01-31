import { create } from 'zustand';
import { templates as INITIAL_TEMPLATES } from '@/templates';

export interface SavedPrompt {
    id: string;
    name: string;
    technique: string | null;
    description?: string;
    sections: Record<string, string>;
    createdAt: number;
    updatedAt: number;
}

interface LibraryState {
    savedPrompts: SavedPrompt[];
    templates: SavedPrompt[];
    currentUserId: string | null;

    // Actions
    initUser: (userId: string) => void;
    clearUser: () => void;

    addPrompt: (prompt: Omit<SavedPrompt, 'id' | 'createdAt' | 'updatedAt'>) => string;
    addTemplate: (template: Omit<SavedPrompt, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updatePrompt: (id: string, updates: Partial<SavedPrompt>) => void;
    updateTemplate: (id: string, updates: Partial<SavedPrompt>) => void;
    deletePrompt: (id: string) => void;
    deleteTemplate: (id: string) => void;
    getPrompt: (id: string) => SavedPrompt | undefined;
}

const STORAGE_PREFIX = 'promptly_data_';

const loadUserData = (userId: string) => {
    const data = localStorage.getItem(STORAGE_PREFIX + userId);
    if (data) {
        return JSON.parse(data);
    }
    // Default initial state for new user
    return {
        savedPrompts: [],
        templates: INITIAL_TEMPLATES.map(t => ({
            ...t,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }))
    };
};

const saveUserData = (userId: string, data: { savedPrompts: SavedPrompt[], templates: SavedPrompt[] }) => {
    localStorage.setItem(STORAGE_PREFIX + userId, JSON.stringify(data));
};

export const useLibraryStore = create<LibraryState>((set, get) => ({
    savedPrompts: [],
    templates: [],
    currentUserId: null,

    initUser: (userId: string) => {
        const userData = loadUserData(userId);
        set({
            currentUserId: userId,
            savedPrompts: userData.savedPrompts,
            templates: userData.templates
        });
    },

    clearUser: () => {
        set({
            currentUserId: null,
            savedPrompts: [],
            templates: []
        });
    },

    addPrompt: (prompt) => {
        const { currentUserId, savedPrompts, templates } = get();
        if (!currentUserId) return '';

        const newPrompt: SavedPrompt = {
            ...prompt,
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        const newSavedPrompts = [newPrompt, ...savedPrompts];

        set({ savedPrompts: newSavedPrompts });
        saveUserData(currentUserId, { savedPrompts: newSavedPrompts, templates });

        return newPrompt.id;
    },

    addTemplate: (template) => {
        const { currentUserId, savedPrompts, templates } = get();
        if (!currentUserId) return;

        const newTemplate: SavedPrompt = {
            ...template,
            id: 'temp-' + Date.now().toString() + Math.random().toString(36).substring(2, 9),
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        const newTemplates = [newTemplate, ...templates];

        set({ templates: newTemplates });
        saveUserData(currentUserId, { savedPrompts, templates: newTemplates });
    },

    updatePrompt: (id, updates) => {
        const { currentUserId, savedPrompts, templates } = get();
        if (!currentUserId) return;

        const newSavedPrompts = savedPrompts.map((prompt) =>
            prompt.id === id
                ? { ...prompt, ...updates, updatedAt: Date.now() }
                : prompt
        );

        set({ savedPrompts: newSavedPrompts });
        saveUserData(currentUserId, { savedPrompts: newSavedPrompts, templates });
    },

    updateTemplate: (id, updates) => {
        const { currentUserId, savedPrompts, templates } = get();
        if (!currentUserId) return;

        const newTemplates = templates.map((t) =>
            t.id === id
                ? { ...t, ...updates, updatedAt: Date.now() }
                : t
        );

        set({ templates: newTemplates });
        saveUserData(currentUserId, { savedPrompts, templates: newTemplates });
    },

    deletePrompt: (id) => {
        const { currentUserId, savedPrompts, templates } = get();
        if (!currentUserId) return;

        const newSavedPrompts = savedPrompts.filter((prompt) => prompt.id !== id);

        set({ savedPrompts: newSavedPrompts });
        saveUserData(currentUserId, { savedPrompts: newSavedPrompts, templates });
    },

    deleteTemplate: (id) => {
        const { currentUserId, savedPrompts, templates } = get();
        if (!currentUserId) return;

        const newTemplates = templates.filter((t) => t.id !== id);

        set({ templates: newTemplates });
        saveUserData(currentUserId, { savedPrompts, templates: newTemplates });
    },

    getPrompt: (id) => {
        return get().savedPrompts.find((prompt) => prompt.id === id);
    },
}));
