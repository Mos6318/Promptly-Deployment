import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ChatPanel } from "./ChatPanel"
import { BuilderPanel } from "./BuilderPanel"
import { RightSidebar } from "./RightSidebar"
import { useState } from "react"

export function WorkspaceLayout() {
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)

    return (
        <div className="h-[calc(100vh-5rem)] w-full overflow-hidden bg-background dark:bg-zinc-950">
            <div className="h-full container mx-auto pl-8 pr-0">
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
