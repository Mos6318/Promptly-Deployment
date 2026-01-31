export default function TemplatesPage() {
    return (
        <div className="container mx-auto p-8 pt-24">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mixer</h1>
                    <p className="text-zinc-500">Mix and match prompt elements to create custom prompts.</p>
                </div>
            </div>

            <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center">
                    <p className="text-muted-foreground text-lg mb-2">Coming Soon</p>
                    <p className="text-muted-foreground/60 text-sm">
                        The Mixer will allow you to combine elements from different prompts
                    </p>
                </div>
            </div>
        </div>
    );
}
