// API Settings Storage Utility
const STORAGE_KEY = 'promptly_api_settings';

export interface ApiSettings {
    gemini: { apiKey: string; enabled: boolean };
    openai: { apiKey: string; enabled: boolean };
    claude: { apiKey: string; enabled: boolean };
    activeProvider: 'gemini' | 'openai' | 'claude' | null;
}

const defaultSettings: ApiSettings = {
    gemini: { apiKey: '', enabled: false },
    openai: { apiKey: '', enabled: false },
    claude: { apiKey: '', enabled: false },
    activeProvider: null,
};

// Simple encoding (not encryption - for MVP only)
function encode(str: string): string {
    return btoa(str);
}

function decode(str: string): string {
    try {
        return atob(str);
    } catch {
        return '';
    }
}

export function saveApiSettings(settings: ApiSettings): void {
    const encoded = {
        gemini: { apiKey: encode(settings.gemini.apiKey), enabled: settings.gemini.enabled },
        openai: { apiKey: encode(settings.openai.apiKey), enabled: settings.openai.enabled },
        claude: { apiKey: encode(settings.claude.apiKey), enabled: settings.claude.enabled },
        activeProvider: settings.activeProvider,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(encoded));
}

export function loadApiSettings(): ApiSettings {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultSettings;

    try {
        const parsed = JSON.parse(stored);
        return {
            gemini: { apiKey: decode(parsed.gemini.apiKey), enabled: parsed.gemini.enabled },
            openai: { apiKey: decode(parsed.openai.apiKey), enabled: parsed.openai.enabled },
            claude: { apiKey: decode(parsed.claude.apiKey), enabled: parsed.claude.enabled },
            activeProvider: parsed.activeProvider,
        };
    } catch {
        return defaultSettings;
    }
}

export function clearApiSettings(): void {
    localStorage.removeItem(STORAGE_KEY);
}
