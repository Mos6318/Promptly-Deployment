import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatBubbleProps {
    role: 'user' | 'assistant';
    content: string;
}

export function ChatBubble({ role, content }: ChatBubbleProps) {
    const { user } = useAuth();
    const isUser = role === 'user';

    return (
        <div className={cn("flex w-full gap-3 mb-6", isUser ? "justify-end" : "justify-start")}>
            {!isUser && (
                <Avatar className="h-8 w-8 mt-1 border border-white/10 shadow-sm">
                    <AvatarImage src="/bot-avatar.png" />
                    <AvatarFallback className="bg-gradient-to-br from-[#CEE1EA] to-[#3C83EB] text-white">
                        <Bot className="h-4 w-4" />
                    </AvatarFallback>
                </Avatar>
            )}

            <div
                className={cn(
                    "max-w-[80%] px-4 py-3 text-sm shadow-sm overflow-hidden",
                    isUser
                        ? "bg-[#EBEFF1] text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 rounded-2xl rounded-tr-sm"
                        : "bg-white/80 dark:bg-zinc-700/80 backdrop-blur-md border border-white/20 dark:border-white/10 text-foreground dark:text-zinc-100 rounded-2xl rounded-tl-sm"
                )}
            >
                <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed break-words">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            p: ({ children }: any) => <p className="mb-2 last:mb-0">{children}</p>,
                            ul: ({ children }: any) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                            ol: ({ children }: any) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                            code: ({ children }: any) => <span className="italic font-sans">{children}</span>,
                            pre: ({ children }: any) => <div className="whitespace-pre-wrap italic font-sans my-2">{children}</div>,
                        }}
                    >
                        {content.replace('[CLEAR]', '').trim()}
                    </ReactMarkdown>
                </div>
            </div>

            {isUser && (
                <Avatar className="h-8 w-8 mt-1 border border-white/10 shadow-sm">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-zinc-200">
                        {user?.name?.charAt(0) || <User className="h-4 w-4" />}
                    </AvatarFallback>
                </Avatar>
            )}
        </div>
    );
}
