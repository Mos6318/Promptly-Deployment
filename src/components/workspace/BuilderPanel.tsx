import { Button } from "@/components/ui/button"
import { PanelRightOpen, PanelRightClose, Save, Edit2, Check, X, Eraser, Trash2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { usePromptStore } from "@/store/promptStore"
import { useLibraryStore } from "@/store/libraryStore"
import { useState } from "react"
import { inferTechniqueFromSections } from "@/lib/promptTechniques"

interface BuilderPanelProps {
    isSidebarOpen: boolean;
    onToggleSidebar: () => void;
}

// Helper function to format camelCase keys to readable labels
function formatSectionLabel(key: string): string {
    const labelMap: Record<string, string> = {
        'task': 'Task',
        'actor': 'Actor',
        'context': 'Context',
        'output': 'Output',
        'examples': 'Examples',
        'role': 'Role',
        'instructions': 'Instructions',
        'steps': 'Steps',
        'endGoal': 'End Goal',
        'narrowing': 'Narrowing',
        'triggerPhrase': 'Trigger Phrase',
        'numberOfOutputs': 'Number of Outputs',
        'selectionCriteria': 'Selection Criteria',
        'explorationPaths': 'Exploration Paths',
        'evaluation': 'Evaluation',
        'systemRole': 'System Role',
        'userInstructions': 'User Instructions',
        'constraints': 'Constraints',
        'freeform': 'Freeform',
    };

    if (labelMap[key]) {
        return labelMap[key];
    }

    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
}

export function BuilderPanel({ isSidebarOpen, onToggleSidebar }: BuilderPanelProps) {
    const currentPrompt = usePromptStore((state) => state.currentPrompt);
    const promptName = usePromptStore((state) => state.promptName);
    const setPromptName = usePromptStore((state) => state.setPromptName);
    const updateSection = usePromptStore((state) => state.updateSection);
    const sectionOrder = usePromptStore((state) => state.sectionOrder);
    const reorderSections = usePromptStore((state) => state.reorderSections);
    const deleteSection = usePromptStore((state) => state.deleteSection);
    const activePromptId = usePromptStore((state) => state.activePromptId);
    const setActivePromptId = usePromptStore((state) => state.setActivePromptId);

    // Compute ordered sections, ensuring all current keys are present
    const orderedKeys = [
        ...sectionOrder.filter(key => currentPrompt.hasOwnProperty(key)),
        ...Object.keys(currentPrompt).filter(key => !sectionOrder.includes(key))
    ];

    const [editingSection, setEditingSection] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");

    const hasContent = Object.values(currentPrompt).some(val => val.trim().length > 0);

    const [isSaving, setIsSaving] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null);

    const handleEditStart = (key: string, value: string) => {
        setEditingSection(key);
        setEditValue(value);
    };

    const handleEditSave = (key: string) => {
        updateSection(key, editValue);
        setEditingSection(null);
        setEditValue("");
    };

    const handleEditCancel = () => {
        setEditingSection(null);
        setEditValue("");
    };

    const handleDeleteSection = (key: string) => {
        deleteSection(key);
        setEditingSection(null);
        setEditValue("");
    };


    const handleSaveToLibrary = (e: React.MouseEvent) => {
        if (isSaving) return;

        const { addPrompt, updatePrompt } = useLibraryStore.getState();

        let saveAsNew = false;
        if (activePromptId) {
            // Check for modifier key (Shift) to force Save as Copy
            if (e.shiftKey) {
                saveAsNew = true;
            } else {
                saveAsNew = false;
            }
        } else {
            // New prompt -> Always create new
            saveAsNew = true;
        }

        setIsSaving(true);

        // Generate summary description from Task and Role
        const summaryParts = [];
        if (currentPrompt['role']) summaryParts.push(`Role: ${currentPrompt['role']}`);
        if (currentPrompt['task']) summaryParts.push(`Task: ${currentPrompt['task']}`);
        const description = summaryParts.join('\n') || Object.values(currentPrompt).join('\n').slice(0, 150) + '...';

        // Determine technique label (e.g "RISEN", "Custom RISEN")
        let currentTechniqueId = usePromptStore.getState().selectedTechnique;
        const techniqueLabel = inferTechniqueFromSections(currentPrompt, currentTechniqueId);

        const currentData = {
            name: promptName || 'Untitled Prompt',
            technique: techniqueLabel,
            description,
            sections: currentPrompt,
        };

        if (saveAsNew) {
            const newId = addPrompt(currentData);
            setActivePromptId(newId);
            if (activePromptId && e.shiftKey) {
                // feedback handled by button state
            } else {
                // feedback handled by button state
            }
        } else {
            if (activePromptId) {
                updatePrompt(activePromptId, currentData);
                // feedback handled by button state
            }
        }

        setTimeout(() => setIsSaving(false), 2000);
    };


    const handleDrop = (e: React.DragEvent, targetIndex?: number) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        setDraggedSectionIndex(null);

        // Handle internal reordering
        if (e.dataTransfer.types.includes('application/x-promptly-reorder')) {
            const oldIndex = parseInt(e.dataTransfer.getData('application/x-promptly-reorder'));
            if (!isNaN(oldIndex) && targetIndex !== undefined && oldIndex !== targetIndex) {
                const newOrder = [...orderedKeys];
                const [movedItem] = newOrder.splice(oldIndex, 1);
                newOrder.splice(targetIndex, 0, movedItem);
                reorderSections(newOrder);
            }
            return;
        }

        // Handle external drop (from Library)
        try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            if (data.sectionKey && data.content) {
                const existingContent = currentPrompt[data.sectionKey] || '';
                const newContent = existingContent
                    ? `${existingContent}\n\n${data.content}`
                    : data.content;

                updateSection(data.sectionKey, newContent);
            }
        } catch (err) {
            console.error('Failed to parse dropped data', err);
        }
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
        e.dataTransfer.setData('application/x-promptly-reorder', index.toString());
        e.dataTransfer.effectAllowed = 'move';
        setDraggedSectionIndex(index);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
        e.dataTransfer.dropEffect = 'copy'; // Default to copy for external, move for internal
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    return (
        <div
            className={`h-full flex flex-col bg-white dark:bg-zinc-900 rounded-[32px] border border-indigo-100 dark:border-zinc-800 shadow-xl overflow-hidden relative ${isDragOver ? 'bg-indigo-50/50 dark:bg-indigo-900/20 ring-2 ring-indigo-500/20' : ''
                }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e)}
        >
            {/* Header */}
            <div className="p-8 pb-4 border-b border-indigo-50/50 dark:border-zinc-800/50 flex items-center justify-between bg-white dark:bg-zinc-900 z-10">
                <div className="flex flex-col gap-1 w-full max-w-md">
                    <h2 className="font-bold tracking-tight text-3xl bg-gradient-to-r from-[#CEE1EA] to-[#3C83EB] bg-clip-text text-transparent">Prompt Preview</h2>
                    <input
                        type="text"
                        placeholder="Name your prompt..."
                        value={promptName}
                        onChange={(e) => setPromptName(e.target.value)}
                        className="text-sm text-muted-foreground bg-transparent border-none focus:outline-none focus:ring-0 p-0 placeholder:text-muted-foreground/50 w-full"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {hasContent && (
                        <>
                            <Button
                                onClick={handleSaveToLibrary}
                                disabled={isSaving}
                                className="bg-gradient-to-r from-[#CEE1EA] to-[#3C83EB] hover:from-[#B8D4E0] hover:to-[#2A6FD9] text-white disabled:opacity-50"
                                size="sm"
                                title="Save (Shift+Click to Save as New)"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {isSaving ? 'Saved!' : 'Save'}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    usePromptStore.getState().clearPrompt();
                                }}
                                className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                                title="Clear Prompt"
                            >
                                <Eraser className="h-5 w-5" />
                            </Button>
                        </>
                    )}
                    <Button variant="ghost" size="icon" onClick={onToggleSidebar} title="Toggle Library">
                        {isSidebarOpen ? <PanelRightClose className="h-5 w-5 text-zinc-500 dark:text-zinc-400" /> : <PanelRightOpen className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />}
                    </Button>
                </div>
            </div>

            {/* Content Scroll Area */}
            <ScrollArea className="flex-1">
                <div className="p-8 space-y-8">
                    {!hasContent ? (
                        <div className="flex items-center justify-center h-64 text-center">
                            <div>
                                <p className="text-muted-foreground text-lg mb-2">No prompt yet</p>
                                <p className="text-muted-foreground/60 text-sm">
                                    Chat with Chad to build your prompt step by step
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {orderedKeys.map((key, index) => {
                                const value = currentPrompt[key];
                                if (!value || typeof value !== 'string' || value.trim().length === 0) {
                                    return null;
                                }

                                const label = formatSectionLabel(key);
                                const isLast = index === orderedKeys.length - 1;
                                const isEditing = editingSection === key;
                                const isDragging = draggedSectionIndex === index;

                                return (
                                    <div
                                        key={key}
                                        draggable={!isEditing}
                                        onDragStart={(e) => !isEditing && handleDragStart(e, index)}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation(); // Stop propagation to parent container
                                        }}
                                        onDrop={(e) => handleDrop(e, index)}
                                        className={`transition-all duration-200 ${isDragging ? 'opacity-50 scale-95' : 'opacity-100'}`}
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-lg text-foreground dark:text-white flex items-center gap-2">
                                                    {label}
                                                </h3>
                                                {isEditing ? (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="icon"
                                                            onClick={() => handleEditSave(key)}
                                                            className="h-8 w-8 bg-gradient-to-r from-[#CEE1EA] to-[#3C83EB] hover:from-[#B8D4E0] hover:to-[#2A6FD9] text-white"
                                                            title="Save changes"
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={handleEditCancel}
                                                            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-gray-100"
                                                            title="Cancel editing"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => handleDeleteSection(key)}
                                                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                            title="Delete section"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditStart(key, value)}
                                                        className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>

                                            {isEditing ? (
                                                <textarea
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="w-full min-h-[120px] p-3 text-sm border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                                                    autoFocus
                                                />
                                            ) : (
                                                <p
                                                    className="text-sm text-zinc-600 dark:text-zinc-300 font-light leading-relaxed whitespace-pre-wrap p-2 rounded-lg transition-colors"
                                                >
                                                    {value}
                                                </p>
                                            )}
                                        </div>
                                        {!isLast && <div className="h-px w-full bg-indigo-50/50 dark:bg-zinc-800/50 mt-6" />}
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}
