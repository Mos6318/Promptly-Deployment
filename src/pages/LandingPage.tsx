import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import heroVisual from '@/assets/hero-3d-visual.png';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-4 md:px-8 py-12 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content (Left) */}
            <div className="flex flex-col gap-6 max-w-2xl ml-16">
                <div className="space-y-2">
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-[#1A1922] dark:text-white">
                        Promptly
                    </h1>
                    <h2 className="text-4xl md:text-6xl font-light text-[#1A1922] dark:text-zinc-100 tracking-tight">
                        Shape learning experience
                    </h2>
                </div>

                <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 my-4" />

                <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-lg leading-relaxed">
                    Easy-to-use web app that equips the next generation of designers and engineers with the foundational skills for innovation: Prompt Creation!
                </p>

                <div className="pt-4">
                    <Button
                        onClick={() => navigate('/workspace')}
                        className="h-14 px-8 rounded-full bg-gradient-to-r from-[#CEE1EA] to-[#3C83EB] hover:from-[#B8D4E0] hover:to-[#2A6FD9] text-white font-semibold text-lg shadow-lg shadow-[#3C83EB]/20 transition-all hover:scale-105"
                    >
                        Create New Prompt
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Visual Content (Right) */}
            <div className="relative">
                <div className="relative z-10 rounded-[2.5rem] border border-zinc-200/50 dark:border-zinc-700/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm p-4 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 overflow-hidden">
                    {/* Grid Background Effect inside the card */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                    <img
                        src={heroVisual}
                        alt="Abstract 3D shapes representing prompt structure"
                        className="w-full h-auto object-cover rounded-[2rem] relative z-20"
                    />

                    {/* Decorative floating elements if needed, but image has them */}
                </div>

                {/* Background Decorative Gradients/Blobs behind the card (optional) */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-promptly-pink/30 rounded-full blur-3xl -z-10 animate-pulse" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-promptly-mint/30 rounded-full blur-3xl -z-10" />
            </div>
        </div>
    );
}
