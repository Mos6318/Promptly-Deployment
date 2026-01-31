
import { cn } from '@/lib/utils';
import type { SavedPrompt } from '@/store/libraryStore';
import { inferTechniqueFromSections } from '@/lib/promptTechniques';

const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
    if (!highlight.trim() || highlight.trim().length < 2) return <>{text}</>;

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));

    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <span key={i} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-100 rounded px-0.5 -mx-0.5">
                        {part}
                    </span>
                ) : (
                    part
                )
            )}
        </>
    );
};

interface MixerCardProps {
    prompt: SavedPrompt;
    formatDate: (timestamp: number) => string;
    formatSectionLabel: (key: string) => string;
    selectedSections?: string[];
    onSectionToggle?: (sectionKey: string, sectionContent: string) => void;
    searchQuery?: string;
    isTemplate?: boolean;
}

export function MixerCard({ prompt, formatDate, formatSectionLabel, selectedSections = [], onSectionToggle, searchQuery = "", isTemplate = false }: MixerCardProps) {

    return (
        <div
            className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow relative h-[600px] flex flex-col overflow-hidden"
        >
            {/* Header & Meta */}
            <div className={cn(
                "p-6 shrink-0",
                isTemplate ? "bg-gradient-to-r from-[#CEE1EA80] to-[#3C83EB80] dark:from-[#CEE1EA] dark:to-[#3C83EB]" : "bg-transparent"
            )}>
                <div className="min-w-0">
                    <h3 className={cn(
                        "font-semibold truncate text-lg",
                        isTemplate ? "text-blue-950 dark:text-blue-950" : "text-foreground dark:text-white"
                    )}>
                        {prompt.name}
                    </h3>
                    <p className={cn(
                        "text-xs mt-1 flex items-center gap-2",
                        isTemplate ? "text-blue-900/80 dark:text-blue-900/80" : "text-zinc-500"
                    )}>
                        {(prompt.technique || inferTechniqueFromSections(prompt.sections)) && (
                            <span className={cn(
                                "px-2 py-0.5 rounded",
                                isTemplate ? "bg-white/50 text-blue-900 dark:bg-white/50 dark:text-blue-900" : "bg-zinc-100 dark:bg-zinc-800"
                            )}>
                                {prompt.technique || inferTechniqueFromSections(prompt.sections)}
                            </span>
                        )}
                        {formatDate(prompt.updatedAt)}
                    </p>
                </div>
            </div>

            {/* Expanded Content Area (Always Visible) */}
            <div className="flex-1 overflow-y-auto p-6 pt-2 pr-2 space-y-4 custom-scrollbar">
                {Object.entries(prompt.sections).map(([key, value]) => {
                    const isSelected = selectedSections.includes(key);
                    return (
                        <div
                            key={key}
                            onClick={() => onSectionToggle?.(key, value)}
                            className={cn(
                                "border-b border-zinc-100 dark:border-zinc-800 last:border-0 pb-3 last:pb-0 cursor-pointer transition-colors p-2 rounded-md",
                                isSelected ? "bg-blue-100 dark:bg-blue-900/30 border-transparent" : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                            )}
                        >
                            <h4 className={cn(
                                "text-xs font-semibold uppercase tracking-wider mb-1.5",
                                isSelected ? "text-blue-600 dark:text-blue-300" : "text-zinc-500"
                            )}>
                                {formatSectionLabel(key)}
                            </h4>
                            <p className={cn(
                                "text-sm whitespace-pre-wrap leading-relaxed",
                                isSelected ? "text-blue-900 dark:text-blue-100" : "text-zinc-700 dark:text-zinc-300"
                            )}>
                                <HighlightText text={value} highlight={searchQuery} />
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
