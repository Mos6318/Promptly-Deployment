import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';

export default function MainLayout() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 flex flex-col">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
}
