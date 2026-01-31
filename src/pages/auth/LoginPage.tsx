import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await login(email, password);
            navigate('/workspace');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] p-4">
            <Card className="w-full max-w-md border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-black/50 backdrop-blur-xl shadow-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#CEE1EA] to-[#3C83EB] bg-clip-text text-transparent w-fit">
                        Welcome back
                    </CardTitle>
                    <CardDescription>
                        Enter your credentials to access your workspace
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="dark:text-white">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 dark:text-zinc-300"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="dark:text-white">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 dark:text-zinc-300"
                        />
                    </div>
                    {error && (
                        <div className="text-sm text-red-500 font-medium">
                            {error}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button
                        className="w-full bg-gradient-to-r from-[#CEE1EA] to-[#3C83EB] text-white border-0 hover:opacity-90"
                        onClick={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging In...' : 'Log In'}
                    </Button>
                    <div className="text-sm text-center text-zinc-500">
                        Don't have an account?{' '}
                        <Link to="/auth/signup" className="text-promptly-purple hover:underline font-medium">
                            Sign Up
                        </Link>
                    </div>
                </CardFooter>
            </Card>

            {/* Decorative Blobs */}
            <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-promptly-pink/20 rounded-full blur-[100px] -z-10" />
            <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-promptly-mint/20 rounded-full blur-[100px] -z-10" />
        </div>
    );
}
