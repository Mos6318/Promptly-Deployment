import { Copy, Pencil, Trash2, Maximize2, Check } from 'lucide-react';
import { useState } from 'react';
import type { SavedPrompt } from '@/store/libraryStore';
import { cn } from '@/lib/utils';
import { inferTechniqueFromSections } from '@/lib/promptTechniques';

interface LibraryCardProps {
    prompt: SavedPrompt;
    onCopy: (prompt: SavedPrompt) => void;
    onEdit: (prompt: SavedPrompt) => void;
    onDelete?: (id: string) => void;
    onUnfold: (prompt: SavedPrompt) => void;
    formatDate: (timestamp: number) => string;
    formatSectionLabel: (key: string) => string;
    isTemplate?: boolean;
}


const IconButton = ({
    icon: Icon,
    onClick,
    label,
    className
}: {
    icon: React.ElementType,
    onClick?: (e: React.MouseEvent) => void,
    label: string,
    className?: string
}) => (
    <button
        onClick={onClick}
        className={cn(
            "p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100",
            className
        )}
        title={label}
        aria-label={label}
    >
        <Icon className="w-4 h-4" />
    </button>
);

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

export function LibraryCard({ prompt, onCopy, onEdit, onDelete, onUnfold, formatDate, formatSectionLabel, searchQuery = "", isTemplate = false }: LibraryCardProps & { searchQuery?: string }) {
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onCopy(prompt);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div
            className={cn(
                "group flex flex-col rounded-xl border shadow-sm hover:shadow-md transition-shadow h-full overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
            )}
            onMouseLeave={() => setIsConfirmingDelete(false)}
        >
            {/* Header Section */}
            <div className={cn(
                "p-5 pb-4 space-y-1",
                isTemplate ? "bg-gradient-to-r from-[#CEE1EA80] to-[#3C83EB80] dark:from-[#CEE1EA] dark:to-[#3C83EB]" : "bg-transparent"
            )}>
                <div className="flex items-start justify-between">
                    <div className="space-y-1 pr-2 w-full">
                        <h3 className={cn(
                            "font-semibold text-lg leading-tight line-clamp-1",
                            isTemplate ? "text-blue-950 dark:text-blue-950" : "text-zinc-900 dark:text-white"
                        )}>
                            {prompt.name}
                        </h3>
                        <div className={cn(
                            "text-xs font-medium flex items-center flex-wrap gap-2",
                            isTemplate ? "text-blue-900/80 dark:text-blue-900/80" : "text-zinc-500"
                        )}>
                            <span>{formatDate(prompt.updatedAt)}</span>
                            {(prompt.technique || inferTechniqueFromSections(prompt.sections)) && (
                                <span className={cn(
                                    "px-2 py-0.5 rounded",
                                    isTemplate
                                        ? "bg-white/40 backdrop-blur-sm text-blue-950 border border-white/20"
                                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                                )}>
                                    {prompt.technique || inferTechniqueFromSections(prompt.sections)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="px-5 flex-grow space-y-3 pt-2">
                <div className="relative">
                    <div className="space-y-3">
                        {/* Only display Task section if available, otherwise fallback to first section */}
                        {prompt.sections['task'] ? (
                            <div>
                                <h4 className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                                    {formatSectionLabel('task')}
                                </h4>
                                <p className="text-sm text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                    <HighlightText text={prompt.sections['task']} highlight={searchQuery} />
                                </p>
                            </div>
                        ) : (
                            /* Fallback: Show first available section logic */
                            Object.entries(prompt.sections).slice(0, 1).map(([key, value]) => (
                                <div key={key}>
                                    <h4 className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                                        {formatSectionLabel(key)}
                                    </h4>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                        <HighlightText text={value} highlight={searchQuery} />
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <div className="p-5 pt-4 mt-auto border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
                <IconButton
                    icon={Maximize2}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onUnfold(prompt);
                    }}
                    label="Unfold"
                />

                <div className="flex items-center gap-1">
                    <IconButton
                        icon={isCopied ? Check : Copy}
                        onClick={handleCopyClick}
                        label={isCopied ? "Copied!" : "Copy"}
                        className={isCopied ? "text-green-500 hover:text-green-600 hover:bg-green-50" : ""}
                    />
                    <IconButton
                        icon={Pencil}
                        onClick={() => onEdit(prompt)}
                        label="Edit"
                    />

                    {onDelete && (isConfirmingDelete ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(prompt.id);
                            }}
                            className="px-3 py-1.5 rounded-md bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors animate-in fade-in zoom-in duration-200"
                        >
                            Confirm
                        </button>
                    ) : (
                        <IconButton
                            icon={Trash2}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsConfirmingDelete(true);
                            }}
                            label="Delete"
                            className="hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
