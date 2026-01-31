import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import { useLibraryStore } from "@/store/libraryStore"
import { usePromptStore } from "@/store/promptStore"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"

export function RightSidebar() {
    const savedPrompts = useLibraryStore((state) => state.savedPrompts)
    const updateSection = usePromptStore((state) => state.updateSection)
    const [searchQuery, setSearchQuery] = useState("")

    // Flatten all prompt sections into a single searchable list
    const searchableSections = useMemo(() => {
        const sections: Array<{
            id: string; // Composite ID: promptId_sectionKey
            promptId: string;
            promptName: string;
            sectionKey: string;
            content: string;
            timestamp: number;
        }> = [];

        savedPrompts.forEach(prompt => {
            Object.entries(prompt.sections).forEach(([key, content]) => {
                if (content.trim()) {
                    sections.push({
                        id: `${prompt.id}_${key}`,
                        promptId: prompt.id,
                        promptName: prompt.name,
                        sectionKey: key,
                        content: content,
                        timestamp: prompt.updatedAt
                    });
                }
            });
        });

        // Sort by newest first
        return sections.sort((a, b) => b.timestamp - a.timestamp);
    }, [savedPrompts]);

    // Filter based on search query
    const filteredSections = useMemo(() => {
        if (!searchQuery.trim()) return searchableSections;

        const lowerQuery = searchQuery.toLowerCase();
        return searchableSections.filter(item =>
            item.content.toLowerCase().includes(lowerQuery) ||
            item.promptName.toLowerCase().includes(lowerQuery) ||
            item.sectionKey.toLowerCase().includes(lowerQuery)
        );
    }, [searchQuery, searchableSections]);

    const handleInsert = (sectionKey: string, content: string) => {
        // TODO: Add visual feedback for insertion
        updateSection(sectionKey, content);
    };

    const formatSectionLabel = (key: string): string => {
        const labelMap: Record<string, string> = {
            'task': 'Task',
            'actor': 'Actor',
            'context': 'Context',
            'output': 'Output',
            'examples': 'Examples',
        };
        return labelMap[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()).trim();
    };


    return (
        <div className="h-full flex flex-col pl-6">
            <div className="py-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search elements..."
                        className="pl-9 rounded-full bg-white dark:bg-zinc-900 border-indigo-100 dark:border-indigo-900 focus-visible:ring-indigo-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {savedPrompts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                        <p>No saved prompts yet.</p>
                        <p className="text-xs opacity-70 mt-1">Save prompts to search their sections here.</p>
                    </div>
                ) : filteredSections.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                        <p>No matching elements found.</p>
                    </div>
                ) : (
                    filteredSections.map((item) => (
                        <div
                            key={item.id}
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData('application/json', JSON.stringify({
                                    sectionKey: item.sectionKey,
                                    content: item.content,
                                    promptName: item.promptName
                                }));
                                e.dataTransfer.effectAllowed = 'copy';
                            }}
                            className="group relative rounded-lg border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50 hover:bg-white dark:hover:bg-zinc-900/50 p-3 transition-all"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                        {formatSectionLabel(item.sectionKey)}
                                    </span>
                                    <span className="text-xs text-muted-foreground truncate max-w-[120px]" title={item.promptName}>
                                        from {item.promptName}
                                    </span>
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-600"
                                    onClick={() => handleInsert(item.sectionKey, item.content)}
                                    title={`Insert into ${formatSectionLabel(item.sectionKey)}`}
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                            <p className="text-sm text-foreground/80 dark:text-zinc-300 font-light leading-relaxed line-clamp-3">
                                {item.content}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
