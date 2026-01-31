import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useLibraryStore, type SavedPrompt } from '@/store/libraryStore';
import { inferTechniqueFromSections } from '@/lib/promptTechniques';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { usePromptStore } from '@/store/promptStore';
import { LibraryCard } from '@/components/library/LibraryCard';
import { PromptModal } from '@/components/library/PromptModal';

export default function LibraryPage() {
    const { savedPrompts, templates, deletePrompt, deleteTemplate } = useLibraryStore();
    const navigate = useNavigate();
    const [selectedPrompt, setSelectedPrompt] = useState<SavedPrompt | null>(null);

    // Use prompt store actions
    const setFullPrompt = usePromptStore((state) => state.setFullPrompt);
    const setPromptName = usePromptStore((state) => state.setPromptName);

    // Combine saved prompts and templates for display (or separate them if preferred)
    // For now, displaying both to ensure we see content.
    // Filter and sort for My Prompts
    // Filter and sort for My Prompts
    const [myPromptsSort, setMyPromptsSort] = useState<string>('updated-desc');
    const [isMyPromptsSearchOpen, setIsMyPromptsSearchOpen] = useState(false);
    const [myPromptsSearchQuery, setMyPromptsSearchQuery] = useState("");

    const filteredSavedPrompts = useMemo(() => {
        if (!myPromptsSearchQuery.trim()) return savedPrompts;
        const lowerQuery = myPromptsSearchQuery.toLowerCase();
        return savedPrompts.filter(p => {
            const technique = p.technique || inferTechniqueFromSections(p.sections);
            return (
                p.name.toLowerCase().includes(lowerQuery) ||
                Object.values(p.sections).some(val => val.toLowerCase().includes(lowerQuery)) ||
                technique.toLowerCase().includes(lowerQuery)
            );
        });
    }, [savedPrompts, myPromptsSearchQuery]);

    const sortedSavedPrompts = useMemo(() => {
        return [...filteredSavedPrompts].sort((a, b) => {
            switch (myPromptsSort) {
                case 'name-asc': return a.name.localeCompare(b.name);
                case 'name-desc': return b.name.localeCompare(a.name);
                case 'created-desc': return b.createdAt - a.createdAt;
                case 'created-asc': return a.createdAt - b.createdAt;
                case 'updated-desc': return b.updatedAt - a.updatedAt;
                case 'updated-asc': return a.updatedAt - b.updatedAt;
                default: return 0;
            }
        });
    }, [filteredSavedPrompts, myPromptsSort]);

    // Filter and sort for Templates
    const [templatesSort, setTemplatesSort] = useState<string>('updated-desc');
    const [isTemplatesSearchOpen, setIsTemplatesSearchOpen] = useState(false);
    const [templatesSearchQuery, setTemplatesSearchQuery] = useState("");

    const filteredTemplates = useMemo(() => {
        if (!templatesSearchQuery.trim()) return templates;
        const lowerQuery = templatesSearchQuery.toLowerCase();
        return templates.filter(p => {
            const technique = p.technique || inferTechniqueFromSections(p.sections);
            return (
                p.name.toLowerCase().includes(lowerQuery) ||
                Object.values(p.sections).some(val => val.toLowerCase().includes(lowerQuery)) ||
                technique.toLowerCase().includes(lowerQuery)
            );
        });
    }, [templates, templatesSearchQuery]);

    const sortedTemplates = useMemo(() => {
        return [...filteredTemplates].sort((a, b) => {
            switch (templatesSort) {
                case 'name-asc': return a.name.localeCompare(b.name);
                case 'name-desc': return b.name.localeCompare(a.name);
                case 'created-desc': return b.createdAt - a.createdAt;
                case 'created-asc': return a.createdAt - b.createdAt;
                case 'updated-desc': return b.updatedAt - a.updatedAt;
                case 'updated-asc': return a.updatedAt - b.updatedAt;
                default: return 0;
            }
        });
    }, [filteredTemplates, templatesSort]);


    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatSectionLabel = (key: string) => {
        return key.charAt(0).toUpperCase() + key.slice(1);
    };

    const handleCopy = (prompt: SavedPrompt) => {
        // Simple clipboard copy implementation
        const content = Object.entries(prompt.sections)
            .map(([k, v]) => `[${formatSectionLabel(k)}]\n${v}`)
            .join('\n\n');
        navigator.clipboard.writeText(content);
        // You might want to add a toast notification here later
        console.log('Copied to clipboard:', prompt.name);
    };

    const handleEdit = (prompt: SavedPrompt) => {
        // Load prompt into workspace
        setFullPrompt(prompt.sections, prompt.technique || undefined, prompt.id);
        setPromptName(prompt.name);

        // Navigate to workspace
        navigate('/workspace');
    };

    const handleUnfold = (prompt: SavedPrompt) => {
        setSelectedPrompt(prompt);
    };

    const handleDelete = (id: string) => {
        // Check if it's a template or saved prompt to call correct delete
        if (savedPrompts.some(p => p.id === id)) {
            deletePrompt(id);
        } else {
            deleteTemplate(id);
        }
    };

    return (
        <div className="container mx-auto p-8 pt-24">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Library</h1>
                    <p className="text-zinc-500">Your saved prompts archive.</p>
                </div>
            </div>

            {/* My Prompts Section */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">My Prompts</h2>
                    <div className="flex items-center gap-2">
                        {isMyPromptsSearchOpen ? (
                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-5 duration-200">
                                <Input
                                    placeholder="Search user prompts..."
                                    value={myPromptsSearchQuery}
                                    onChange={(e) => setMyPromptsSearchQuery(e.target.value)}
                                    className="w-[400px] focus-visible:ring-blue-500 focus-visible:ring-1"
                                    autoFocus
                                />
                                <Button variant="ghost" size="icon" onClick={() => {
                                    setIsMyPromptsSearchOpen(false);
                                    setMyPromptsSearchQuery("");
                                }} className="hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                    <span className="text-zinc-500">×</span>
                                </Button>
                            </div>
                        ) : (
                            <Button variant="ghost" size="icon" onClick={() => setIsMyPromptsSearchOpen(true)} className="hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                <Search className="h-5 w-5 text-zinc-500" />
                            </Button>
                        )}
                        <Select value={myPromptsSort} onValueChange={setMyPromptsSort}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="updated-desc">Last Updated</SelectItem>
                                <SelectItem value="created-desc">Newest First</SelectItem>
                                <SelectItem value="created-asc">Oldest First</SelectItem>
                                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {sortedSavedPrompts.length === 0 ? (
                    <div className="text-center py-12 border border-dashed rounded-xl border-zinc-200 dark:border-zinc-800">
                        <p className="text-muted-foreground text-lg mb-2">No saved prompts found</p>
                        <p className="text-muted-foreground/60 text-sm">
                            {myPromptsSearchQuery ? "Try a different search term" : "Create some prompts in the Mixer to see them here!"}
                        </p>
                    </div>
                ) : (
                    <div className="px-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sortedSavedPrompts.map((prompt) => (
                                <LibraryCard
                                    key={prompt.id}
                                    prompt={prompt}
                                    onCopy={handleCopy}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onUnfold={handleUnfold}
                                    formatDate={formatDate}
                                    formatSectionLabel={formatSectionLabel}
                                    searchQuery={myPromptsSearchQuery}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Templates Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Templates</h2>
                    <div className="flex items-center gap-2">
                        {isTemplatesSearchOpen ? (
                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-5 duration-200">
                                <Input
                                    placeholder="Search templates..."
                                    value={templatesSearchQuery}
                                    onChange={(e) => setTemplatesSearchQuery(e.target.value)}
                                    className="w-[400px] focus-visible:ring-blue-500 focus-visible:ring-1"
                                    autoFocus
                                />
                                <Button variant="ghost" size="icon" onClick={() => {
                                    setIsTemplatesSearchOpen(false);
                                    setTemplatesSearchQuery("");
                                }} className="hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                    <span className="text-zinc-500">×</span>
                                </Button>
                            </div>
                        ) : (
                            <Button variant="ghost" size="icon" onClick={() => setIsTemplatesSearchOpen(true)} className="hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                <Search className="h-5 w-5 text-zinc-500" />
                            </Button>
                        )}
                        <Select value={templatesSort} onValueChange={setTemplatesSort}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="updated-desc">Last Updated</SelectItem>
                                <SelectItem value="created-desc">Newest First</SelectItem>
                                <SelectItem value="created-asc">Oldest First</SelectItem>
                                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {sortedTemplates.length === 0 ? (
                    <div className="text-center py-12 border border-dashed rounded-xl border-zinc-200 dark:border-zinc-800">
                        <p className="text-muted-foreground text-lg mb-2">No templates found</p>
                        <p className="text-muted-foreground/60 text-sm">
                            {templatesSearchQuery ? "Try a different search term" : "Add some templates to get started!"}
                        </p>
                    </div>
                ) : (
                    <div className="px-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sortedTemplates.map((prompt) => (
                                <LibraryCard
                                    key={prompt.id}
                                    prompt={prompt}
                                    onCopy={handleCopy}
                                    onEdit={handleEdit}
                                    onUnfold={handleUnfold}
                                    formatDate={formatDate}
                                    formatSectionLabel={formatSectionLabel}
                                    searchQuery={templatesSearchQuery}
                                    isTemplate={true}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <PromptModal
                prompt={selectedPrompt}
                onClose={() => setSelectedPrompt(null)}
                onEdit={handleEdit}
            />
        </div>
    );
}
