import { X, Copy, Check, Pencil } from 'lucide-react';
import { useState } from 'react';
import type { SavedPrompt } from '@/store/libraryStore';
import { inferTechniqueFromSections } from '@/lib/promptTechniques';

interface PromptModalProps {
    prompt: SavedPrompt | null;
    onClose: () => void;
    onEdit: (prompt: SavedPrompt) => void;
}

export function PromptModal({ prompt, onClose, onEdit }: PromptModalProps) {
    const [isCopied, setIsCopied] = useState(false);

    if (!prompt) return null;

    const handleCopy = () => {
        const content = Object.entries(prompt.sections)
            .map(([k, v]) => `[${k.charAt(0).toUpperCase() + k.slice(1)}]\n${v}`)
            .join('\n\n');
        navigator.clipboard.writeText(content);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col h-[95vh] animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 pr-4">
                            {prompt.name}
                        </h2>
                        {prompt.technique || inferTechniqueFromSections(prompt.sections) ? (
                            <span className="inline-block mt-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs px-2 py-0.5 rounded font-medium">
                                {prompt.technique || inferTechniqueFromSections(prompt.sections)}
                            </span>
                        ) : null}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopy}
                            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            title="Copy All"
                        >
                            {isCopied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={() => onEdit(prompt)}
                            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            title="Edit Prompt"
                        >
                            <Pencil className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-zinc-400 hover:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                            title="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {Object.entries(prompt.sections).map(([key, value]) => (
                        <div key={key}>
                            <h4 className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                                {key}
                            </h4>
                            <div className="text-sm text-muted-foreground font-light leading-relaxed whitespace-pre-wrap">
                                {value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
