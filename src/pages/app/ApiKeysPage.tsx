import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Check, Key } from 'lucide-react';
import { loadApiSettings, saveApiSettings, type ApiSettings } from '@/lib/storage';

export default function ApiKeysPage() {
    const [settings, setSettings] = useState<ApiSettings>(loadApiSettings());
    const [showKeys, setShowKeys] = useState({
        gemini: false,
        openai: false,
        claude: false,
    });
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        saveApiSettings(settings);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const toggleKeyVisibility = (provider: keyof typeof showKeys) => {
        setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
    };

    const updateApiKey = (provider: 'gemini' | 'openai' | 'claude', apiKey: string) => {
        setSettings(prev => ({
            ...prev,
            [provider]: { ...prev[provider], apiKey, enabled: apiKey.length > 0 },
        }));
    };

    const setActiveProvider = (provider: 'gemini' | 'openai' | 'claude') => {
        setSettings(prev => ({ ...prev, activeProvider: provider }));
    };

    return (
        <div className="container mx-auto p-8 pt-24 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
                <p className="text-muted-foreground mt-2">
                    Configure your AI provider keys to power the Promptly Mixer
                </p>
            </div>

            <div className="space-y-6">


                {/* Gemini */}
                <div className="p-6 rounded-xl border shadow-sm transition-colors border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-semibold text-lg dark:text-white">Google Gemini</h3>
                            <p className="text-sm text-muted-foreground">Get your API key from Google AI Studio</p>
                        </div>
                        <input
                            type="radio"
                            name="activeProvider"
                            checked={settings.activeProvider === 'gemini'}
                            onChange={() => setActiveProvider('gemini')}
                            disabled={!settings.gemini.apiKey}
                            className="h-4 w-4"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gemini-key">API Key</Label>
                        <div className="relative">
                            <Input
                                id="gemini-key"
                                type={showKeys.gemini ? 'text' : 'password'}
                                value={settings.gemini.apiKey}
                                onChange={(e) => updateApiKey('gemini', e.target.value)}
                                placeholder="Enter your Gemini API key"
                                className="pr-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                            />
                            <button
                                type="button"
                                onClick={() => toggleKeyVisibility('gemini')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showKeys.gemini ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* OpenAI */}
                <div className="p-6 rounded-xl border shadow-sm transition-colors border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-semibold text-lg dark:text-white">OpenAI (ChatGPT)</h3>
                            <p className="text-sm text-muted-foreground">Get your API key from OpenAI Platform</p>
                        </div>
                        <input
                            type="radio"
                            name="activeProvider"
                            checked={settings.activeProvider === 'openai'}
                            onChange={() => setActiveProvider('openai')}
                            disabled={!settings.openai.apiKey}
                            className="h-4 w-4"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="openai-key">API Key</Label>
                        <div className="relative">
                            <Input
                                id="openai-key"
                                type={showKeys.openai ? 'text' : 'password'}
                                value={settings.openai.apiKey}
                                onChange={(e) => updateApiKey('openai', e.target.value)}
                                placeholder="Enter your OpenAI API key"
                                className="pr-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                            />
                            <button
                                type="button"
                                onClick={() => toggleKeyVisibility('openai')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showKeys.openai ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Claude */}
                <div className="p-6 rounded-xl border shadow-sm transition-colors border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-semibold text-lg dark:text-white">Anthropic Claude</h3>
                            <p className="text-sm text-muted-foreground">Get your API key from Anthropic Console</p>
                        </div>
                        <input
                            type="radio"
                            name="activeProvider"
                            checked={settings.activeProvider === 'claude'}
                            onChange={() => setActiveProvider('claude')}
                            disabled={!settings.claude.apiKey}
                            className="h-4 w-4"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="claude-key">API Key</Label>
                        <div className="relative">
                            <Input
                                id="claude-key"
                                type={showKeys.claude ? 'text' : 'password'}
                                value={settings.claude.apiKey}
                                onChange={(e) => updateApiKey('claude', e.target.value)}
                                placeholder="Enter your Claude API key"
                                className="pr-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                            />
                            <button
                                type="button"
                                onClick={() => toggleKeyVisibility('claude')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showKeys.claude ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Security Warning */}
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                    <p className="text-sm text-amber-900 dark:text-amber-200">
                        <strong>Security Note:</strong> API keys are stored locally in your browser. Never share your keys with others.
                        Your keys are only used to make direct API calls from your browser to the AI providers.
                    </p>
                </div>

                {/* Save Button */}
                <div className="flex items-center gap-4">
                    <Button
                        onClick={handleSave}
                        size="lg"
                        className="min-w-32 bg-gradient-to-r from-[#CEE1EA] to-[#3C83EB] text-blue-950 border-none hover:opacity-90 transition-opacity"
                    >
                        Save API Keys
                    </Button>
                    {saved && (
                        <div className="flex items-center gap-2 text-green-600">
                            <Check className="h-5 w-5" />
                            <span className="text-sm font-medium">Keys saved!</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
