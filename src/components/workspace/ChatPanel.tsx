import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect } from "react"
import { ChatBubble } from "./ChatBubble"
import { sendMessage } from "@/lib/api"
import { loadApiSettings } from "@/lib/storage"
import { Send, Paperclip, Bot, Sparkles } from "lucide-react"
import { useChatStore } from "@/store/chatStore"
import { usePromptStore } from "@/store/promptStore"
import { getChadSystemPrompt } from "@/lib/chadSystemPrompt"
import { detectCurrentSection, isUserConfirming } from "@/lib/sectionParser"

export function ChatPanel() {
    const messages = useChatStore((state) => state.messages);
    const addMessage = useChatStore((state) => state.addMessage);
    const attachedFiles = useChatStore((state) => state.conversationState.attachedFiles);
    const addFile = useChatStore((state) => state.addFile);
    const removeFile = useChatStore((state) => state.removeFile);
    const setCurrentSection = useChatStore((state) => state.setCurrentSection);

    const updateSection = usePromptStore((state) => state.updateSection);
    const currentPrompt = usePromptStore((state) => state.currentPrompt);
    const selectedTechnique = usePromptStore((state) => state.selectedTechnique);

    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Track pending refinement for confirmation
    const [pendingRefinement, setPendingRefinement] = useState<{ sectionKey: string, content: string } | null>(null);

    // Detect sections and Actions when new assistant messages arrive
    useEffect(() => {
        const lastMessage = messages[messages.length - 1];

        if (lastMessage && lastMessage.role === 'assistant') {
            // Check for Actions
            if (lastMessage.content.includes('[CLEAR]')) {
                usePromptStore.getState().clearPrompt();
                setPendingRefinement(null); // Clear any pending refinement
                // We let the flow continue so the text message ("Done!...") is still processed/shown
            }

            const detection = detectCurrentSection(lastMessage.content);

            if (detection.sectionKey && detection.proposedContent) {
                // Update current section being discussed
                setCurrentSection(detection.sectionKey);

                // Check if this is a refinement (section already exists) or new section
                const isRefinement = currentPrompt.hasOwnProperty(detection.sectionKey);

                if (isRefinement) {
                    // For refinements: store as pending, wait for user confirmation
                    setPendingRefinement({
                        sectionKey: detection.sectionKey,
                        content: detection.proposedContent
                    });
                } else {
                    // For new sections: update immediately
                    updateSection(detection.sectionKey, detection.proposedContent);
                    setPendingRefinement(null);
                }
            }
        }
    }, [messages, setCurrentSection, updateSection, currentPrompt]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        // Check if user is confirming a pending refinement
        if (pendingRefinement && isUserConfirming(inputValue)) {
            updateSection(pendingRefinement.sectionKey, pendingRefinement.content);
            setPendingRefinement(null);
        }

        // Check if API is configured
        const settings = loadApiSettings();
        if (!settings.activeProvider || !settings[settings.activeProvider].apiKey) {
            addMessage({
                role: 'assistant',
                content: 'Please configure your API key in Settings to start chatting with Chad.'
            });
            return;
        }

        // Add User Message
        addMessage({
            role: 'user',
            content: inputValue
        });

        const currentInput = inputValue;
        setInputValue("");
        setIsLoading(true);

        try {
            // Build current prompt state context for Chad
            let promptContext = '';
            if (Object.keys(currentPrompt).length > 0) {
                const sectionsList = Object.entries(currentPrompt)
                    .map(([key, value]) => `  - ${key}: ${value.substring(0, 100)}${value.length > 100 ? '...' : ''}`)
                    .join('\n');

                promptContext = `\n\nCurrent Prompt State:\nTechnique: ${selectedTechnique || 'Not set'}\nSections:\n${sectionsList}\n\n`;
            }

            // Prepend Chad's system prompt to guide the conversation
            const systemPrompt = getChadSystemPrompt();
            const messagesWithSystem = [
                { role: 'assistant' as const, content: systemPrompt },
                ...messages.map(m => ({ role: m.role, content: m.content })),
                { role: 'user' as const, content: promptContext + currentInput }
            ];

            const response = await sendMessage(
                messagesWithSystem,
                settings.activeProvider,
                settings[settings.activeProvider].apiKey
            );

            if (response.error) {
                addMessage({
                    role: 'assistant',
                    content: `Error: ${response.error}. Please check your API key in Settings.`
                });
            } else {
                addMessage({
                    role: 'assistant',
                    content: response.content
                });
            }
        } catch (error) {
            addMessage({
                role: 'assistant',
                content: 'An unexpected error occurred. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach((file) => {
            // Check file size (10MB for PDFs, 5MB for images)
            const maxSize = file.type.includes('pdf') ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
            if (file.size > maxSize) {
                alert(`File ${file.name} is too large. Max size: ${maxSize / (1024 * 1024)}MB`);
                return;
            }

            // Create file preview for images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    addFile({
                        id: Date.now().toString() + Math.random(),
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        preview: e.target?.result as string,
                    });
                };
                reader.readAsDataURL(file);
            } else if (file.type === 'application/pdf') {
                // For PDFs, just store metadata for now
                // We'll extract text when sending to AI
                addFile({
                    id: Date.now().toString() + Math.random(),
                    name: file.name,
                    type: file.type,
                    size: file.size,
                });
            }
        });

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }

    return (
        <div className="h-full flex flex-col relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-[-1]">
                <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-purple-200/30 dark:bg-purple-900/10 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-[10%] right-[-5%] w-[250px] h-[250px] bg-pink-200/30 dark:bg-pink-900/10 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="pt-12 pb-6 flex flex-col gap-2 z-10">
                <h2 className="font-bold tracking-tight text-4xl text-foreground/90 dark:text-white">Chat with Chad</h2>
                <p className="text-lg text-muted-foreground/80 font-light">Your AI Prompt Assistant</p>
            </div>

            <ScrollArea className="flex-1 p-6">
                <div className="flex flex-col justify-end min-h-full pb-4">
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center flex-1 h-full min-h-[300px] gap-2">
                            <Sparkles className="h-5 w-5 text-indigo-400" />
                            <p className="text-lg font-light text-muted-foreground/40 text-center tracking-tight">
                                What is on your mind today?
                            </p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <ChatBubble key={msg.id} role={msg.role} content={msg.content} />
                        ))
                    )}
                    {isLoading && (
                        <div className="flex gap-3 mb-6">
                            <div className="h-8 w-8 mt-1 rounded-full bg-gradient-to-br from-[#CEE1EA] to-[#3C83EB] flex items-center justify-center">
                                <Bot className="h-4 w-4 text-white" />
                            </div>
                            <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="py-8 z-10 w-full px-4">
                <div className="flex flex-col gap-4">
                    {/* File previews */}
                    {attachedFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {attachedFiles.map((file) => (
                                <div
                                    key={file.id}
                                    className="relative group bg-white/80 dark:bg-zinc-800/80 rounded-lg p-2 pr-8 border border-indigo-200 dark:border-indigo-800"
                                >
                                    {file.preview ? (
                                        <img src={file.preview} alt={file.name} className="h-16 w-16 object-cover rounded" />
                                    ) : (
                                        <div className="h-16 w-16 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900 rounded">
                                            <Paperclip className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                    )}
                                    <button
                                        onClick={() => removeFile(file.id)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        ×
                                    </button>
                                    <p className="text-xs mt-1 max-w-[64px] truncate">{file.name}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Input area with buttons */}
                    <div className="relative">
                        <textarea
                            className="w-full min-h-[140px] p-6 pr-24 rounded-[32px] border border-indigo-200 dark:border-indigo-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-[0_8px_30px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 resize-none text-sm text-foreground dark:text-zinc-200 placeholder:text-muted-foreground/50 transition-all"
                            placeholder="Type your message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />

                        {/* Button container */}
                        <div className="absolute bottom-4 right-4 flex gap-2">
                            {/* File upload button */}
                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() => fileInputRef.current?.click()}
                                className="h-10 w-10 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                            >
                                <Paperclip className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                            </Button>

                            {/* Send button */}
                            <Button
                                type="button"
                                size="icon"
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isLoading}
                                className="h-10 w-10 rounded-full bg-[#3C83EB] hover:bg-[#2A6FD9] disabled:opacity-50"
                            >
                                <Send className="h-5 w-5 text-white" />
                            </Button>
                        </div>

                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg,.webp"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
