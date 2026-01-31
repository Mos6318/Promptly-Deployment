import { create } from 'zustand';

// Dynamic prompt sections based on technique
export type PromptSections = Record<string, string>;

export interface PromptState {
    currentPrompt: PromptSections;
    promptName: string;
    selectedTechnique: string | null;
    sectionOrder: string[]; // Track order of sections
    setPromptName: (name: string) => void;
    updateSection: (section: string, content: string) => void;
    deleteSection: (section: string) => void;
    setFullPrompt: (prompt: PromptSections, technique?: string, id?: string) => void;
    clearPrompt: () => void;
    setTechnique: (technique: string) => void;
    reorderSections: (newOrder: string[]) => void;

    // New: Track active prompt ID for updates
    activePromptId: string | null;
    setActivePromptId: (id: string | null) => void;
}

export const usePromptStore = create<PromptState>((set) => ({
    currentPrompt: {},
    promptName: '',
    selectedTechnique: null,
    sectionOrder: [],

    activePromptId: null,
    setActivePromptId: (id) => set({ activePromptId: id }),

    setPromptName: (name) => set({ promptName: name }),

    updateSection: (section, content) =>
        set((state) => {
            const isNewSection = !state.currentPrompt.hasOwnProperty(section);
            return {
                currentPrompt: {
                    ...state.currentPrompt,
                    [section]: content,
                },
                sectionOrder: isNewSection
                    ? [...state.sectionOrder, section]
                    : state.sectionOrder
            };
        }),

    deleteSection: (section) =>
        set((state) => {
            const { [section]: removed, ...remainingPrompt } = state.currentPrompt;
            return {
                currentPrompt: remainingPrompt,
                sectionOrder: state.sectionOrder.filter(key => key !== section)
            };
        }),

    setFullPrompt: (prompt, technique, id) => set({
        currentPrompt: prompt,
        selectedTechnique: technique || null,
        sectionOrder: Object.keys(prompt),
        activePromptId: id || null,
    }),

    setTechnique: (technique) => set({ selectedTechnique: technique }),

    reorderSections: (newOrder) => set({ sectionOrder: newOrder }),

    clearPrompt: () => set({
        currentPrompt: {},
        promptName: '',
        selectedTechnique: null,
        sectionOrder: [],
        activePromptId: null,
    }),
}));
