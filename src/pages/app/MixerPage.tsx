import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLibraryStore } from '@/store/libraryStore';
import { usePromptStore } from '@/store/promptStore';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { inferTechniqueFromSections } from '@/lib/promptTechniques';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MixerCard } from '@/components/library/MixerCard';

export default function MixerPage() {
    const savedPrompts = useLibraryStore((state) => state.savedPrompts);
    const templates = useLibraryStore((state) => state.templates);
    const setFullPrompt = usePromptStore((state) => state.setFullPrompt);
    const navigate = useNavigate();

    // State for selected sections: Map<PromptID, Set<SectionKey>> 
    // Actually, to make mixing easier, let's store the actual content mapped by section key.
    // But we need to switch selections.
    // Let's store: Record<PromptID, string[]> (list of selected section keys per prompt)
    const [selections, setSelections] = useState<Record<string, string[]>>({});

    const handleSectionToggle = (promptId: string, sectionKey: string) => {
        setSelections(prev => {
            const currentPromptSelections = prev[promptId] || [];
            if (currentPromptSelections.includes(sectionKey)) {
                return {
                    ...prev,
                    [promptId]: currentPromptSelections.filter(k => k !== sectionKey)
                };
            } else {
                return {
                    ...prev,
                    [promptId]: [...currentPromptSelections, sectionKey]
                };
            }
        });
    };

    const handleMix = () => {
        // 1. Gather all selected content
        const mixedSections: Record<string, string> = {};

        // Helper to find prompt by ID (could be optimized with a map but this is fine for small lists)
        const allPrompts = [...savedPrompts, ...templates];

        Object.entries(selections).forEach(([promptId, selectedKeys]) => {
            const prompt = allPrompts.find(p => p.id === promptId);
            if (!prompt) return;

            selectedKeys.forEach(key => {
                const content = prompt.sections[key];
                if (content) {
                    if (mixedSections[key]) {
                        mixedSections[key] += "\n\n" + content;
                    } else {
                        mixedSections[key] = content;
                    }
                }
            });
        });

        // 2. Set to store
        // We use a generated ID or null for ID since it's a new mix
        setFullPrompt(mixedSections, undefined, undefined);

        // 3. Navigate
        navigate('/workspace');
    };

    const formatDate = (timestamp: number) => {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return new Date(timestamp).toLocaleDateString();
    };

    const [sortOption, setSortOption] = useState<string>('updated-desc');
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

    const sortedPrompts = useMemo(() => {
        return [...filteredSavedPrompts].sort((a, b) => {
            switch (sortOption) {
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'created-desc':
                    return b.createdAt - a.createdAt;
                case 'created-asc':
                    return a.createdAt - b.createdAt;
                case 'updated-desc':
                    return b.updatedAt - a.updatedAt;
                case 'updated-asc':
                    return a.updatedAt - b.updatedAt;
                default:
                    return 0;
            }
        });
    }, [filteredSavedPrompts, sortOption]);

    const [templateSortOption, setTemplateSortOption] = useState<string>('updated-desc');
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
            switch (templateSortOption) {
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'created-desc':
                    return b.createdAt - a.createdAt;
                case 'created-asc':
                    return a.createdAt - b.createdAt;
                case 'updated-desc':
                    return b.updatedAt - a.updatedAt;
                case 'updated-asc':
                    return a.updatedAt - b.updatedAt;
                default:
                    return 0;
            }
        });
    }, [filteredTemplates, templateSortOption]);





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
        <div className="container mx-auto p-8 pt-24">
            {/* My Prompts Section */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mixer</h1>
                    <p className="text-zinc-500">Mix and match sections from templates and prompts.</p>
                </div>
                <Button
                    onClick={handleMix}
                    className="bg-gradient-to-r from-[#CEE1EA] to-[#3C83EB] hover:from-[#B8D4E0] hover:to-[#2A6FD9] text-white"
                >
                    Mix New Prompt
                </Button>
            </div>

            <div className="mb-12">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">My Prompts</h2>
                    <div className="flex items-center gap-2">
                        {isMyPromptsSearchOpen ? (
                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-5 duration-200">
                                <Input
                                    placeholder="Search user prompts..."
                                    value={myPromptsSearchQuery}
                                    onChange={(e) => setMyPromptsSearchQuery(e.target.value)}
                                    className="w-[300px] focus-visible:ring-blue-500 focus-visible:ring-1"
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
                        <Select value={sortOption} onValueChange={setSortOption}>
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

                {sortedPrompts.length === 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="col-span-full text-center py-12">
                            <p className="text-muted-foreground text-lg mb-2">No saved prompts found</p>
                            <p className="text-muted-foreground/60 text-sm mb-4">
                                {myPromptsSearchQuery ? "Try a different search term" : "Create your first prompt in the workspace"}
                            </p>
                            <Button
                                onClick={handleMix}
                                className="bg-gradient-to-r from-[#CEE1EA] to-[#3C83EB] hover:from-[#B8D4E0] hover:to-[#2A6FD9] text-white"
                            >
                                Mix New Prompt
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="relative px-12">
                        <Carousel
                            opts={{
                                align: "start",
                                loop: false,
                            }}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-4">
                                {sortedPrompts.map((prompt) => (
                                    <CarouselItem key={prompt.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                        <MixerCard
                                            prompt={prompt}
                                            formatDate={formatDate}
                                            formatSectionLabel={formatSectionLabel}
                                            selectedSections={selections[prompt.id]}
                                            onSectionToggle={(key) => handleSectionToggle(prompt.id, key)}
                                            searchQuery={myPromptsSearchQuery}
                                        />
                                    </CarouselItem>
                                ))}
                                <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                                    <div
                                        onClick={handleMix}
                                        className="flex flex-col items-center justify-center p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 !bg-transparent border-dashed hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer h-[600px]"
                                    >
                                        <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
                                            <span className="text-2xl text-zinc-400">+</span>
                                        </div>
                                        <span className="font-medium text-zinc-500">Mix New Prompt</span>
                                    </div>
                                </CarouselItem>
                            </CarouselContent>
                            <CarouselPrevious className="border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700" />
                            <CarouselNext className="border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700" />
                        </Carousel>
                    </div>
                )}
            </div>

            {/* Templates Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Templates</h2>
                    <div className="flex items-center gap-2">
                        {isTemplatesSearchOpen ? (
                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-5 duration-200">
                                <Input
                                    placeholder="Search templates..."
                                    value={templatesSearchQuery}
                                    onChange={(e) => setTemplatesSearchQuery(e.target.value)}
                                    className="w-[300px] focus-visible:ring-blue-500 focus-visible:ring-1"
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
                        <Select value={templateSortOption} onValueChange={setTemplateSortOption}>
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
                <div className="relative px-12">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: false,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                            {sortedTemplates.map((template) => (
                                <CarouselItem key={template.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                    <MixerCard
                                        prompt={template}
                                        formatDate={formatDate}
                                        formatSectionLabel={formatSectionLabel}
                                        selectedSections={selections[template.id]}
                                        onSectionToggle={(key) => handleSectionToggle(template.id, key)}
                                        searchQuery={templatesSearchQuery}
                                        isTemplate={true}
                                    />
                                </CarouselItem>
                            ))}
                            <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                                <div
                                    onClick={handleMix}
                                    className="flex flex-col items-center justify-center p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 !bg-transparent border-dashed hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer h-[600px]"
                                >
                                    <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
                                        <span className="text-2xl text-zinc-400">+</span>
                                    </div>
                                    <span className="font-medium text-zinc-500">Mix New Prompt</span>
                                </div>
                            </CarouselItem>
                        </CarouselContent>
                        <CarouselPrevious className="border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700" />
                        <CarouselNext className="border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700" />
                    </Carousel>
                </div>
            </div>
        </div >
    );
}
