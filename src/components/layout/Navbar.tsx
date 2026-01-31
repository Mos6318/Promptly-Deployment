import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/50 backdrop-blur-md dark:bg-black/50 dark:border-white/5">
            <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#CEE1EA] to-[#3C83EB]" />
                    <span className="text-xl font-bold tracking-tight">Promptly</span>
                </Link>

                {/* Navigation Links */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
                    <Link to="/library" className="hover:text-black dark:hover:text-white transition-colors">Library</Link>
                    <Link to="/mixer" className="hover:text-black dark:hover:text-white transition-colors">Mixer</Link>
                    <Link to="/workspace" className="hover:text-black dark:hover:text-white transition-colors">Workbench</Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium hidden md:block">{user.nickname || user.name}</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                        <Avatar className="h-10 w-10 border border-zinc-200">
                                            <AvatarImage src={user.avatar} alt={user.nickname || user.name} />
                                            <AvatarFallback>{(user.nickname || user.name).charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.nickname || user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                                        Profile Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate('/api-keys')}>
                                        API Keys
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <>
                            <Link to="/auth/login">
                                <Button variant="ghost" className="font-medium">Log In</Button>
                            </Link>
                            <Link to="/auth/signup">
                                <Button className="rounded-full bg-[#1A1922] text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-semibold px-6">
                                    Sign Up
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
