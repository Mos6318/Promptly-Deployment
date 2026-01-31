import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ChatPanel } from "./ChatPanel"
import { BuilderPanel } from "./BuilderPanel"
import { RightSidebar } from "./RightSidebar"
import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Link } from "react-router-dom"
import { AlertCircle } from "lucide-react"

export function WorkspaceLayout() {
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
    const { user } = useAuth()

    return (
        <div className="h-[calc(100vh-5rem)] w-full overflow-hidden bg-background dark:bg-zinc-950 relative">
            {!user && (
                <div className="absolute top-0 left-0 right-0 z-50 bg-blue-500/10 border-b border-blue-500/20 backdrop-blur-sm px-4 py-2 flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>You are in guest mode.</span>
                    <Link to="/auth/login" className="font-semibold hover:underline">Log in</Link>
                    <span>to save your prompts.</span>
                </div>
            )}
            <div className={`h-full container mx-auto pl-8 pr-0 ${!user ? 'pt-10' : ''}`}>
                <ResizablePanelGroup direction="horizontal" className="h-full w-full">

                    {/* Left Panel: Chat */}
                    <ResizablePanel defaultSize={30} minSize={20} maxSize={75} className="bg-transparent border-none">
                        <ChatPanel />
                    </ResizablePanel>

                    <ResizableHandle className="bg-transparent w-4 hover:bg-transparent transition-none after:hidden" />

                    {/* Middle Panel: Builder */}
                    <ResizablePanel defaultSize={isRightSidebarOpen ? 50 : 70} minSize={30} className="bg-transparent border-none py-4 px-10">
                        <BuilderPanel
                            isSidebarOpen={isRightSidebarOpen}
                            onToggleSidebar={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                        />
                    </ResizablePanel>

                    {/* Right Sidebar: Library (Collapsible) */}
                    {isRightSidebarOpen && (
                        <>
                            <ResizableHandle className="bg-transparent w-4 hover:bg-transparent transition-none after:hidden" />
                            <ResizablePanel defaultSize={20} minSize={15} maxSize={25} className="bg-transparent border-none">
                                <RightSidebar />
                            </ResizablePanel>
                        </>
                    )}

                </ResizablePanelGroup>
            </div>
        </div>
    )
}
