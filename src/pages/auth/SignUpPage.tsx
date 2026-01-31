import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

export default function SignUpPage() {
    const navigate = useNavigate();
    const { signup } = useAuth();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignup = async () => {
        if (!firstName || !email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await signup(`${firstName} ${lastName}`, email, password);
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
                        Create an account
                    </CardTitle>
                    <CardDescription>
                        Start shaping your learning experience today
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first-name" className="dark:text-white">First name</Label>
                            <Input
                                id="first-name"
                                placeholder="Max"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last-name" className="dark:text-white">Last name</Label>
                            <Input
                                id="last-name"
                                placeholder="Robinson"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="dark:text-white">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="dark:text-white">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 dark:text-zinc-300 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-300 hover:text-zinc-700 dark:hover:text-zinc-100"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
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
                        onClick={handleSignup}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                    <div className="text-sm text-center text-zinc-500">
                        Already have an account?{' '}
                        <Link to="/auth/login" className="text-teal-500 hover:underline font-medium">
                            Log In
                        </Link>
                    </div>
                </CardFooter>
            </Card>

            {/* Decorative Blobs */}
            <div className="fixed top-20 right-20 w-64 h-64 bg-promptly-yellow/20 rounded-full blur-[80px] -z-10" />
            <div className="fixed bottom-20 left-20 w-80 h-80 bg-promptly-purple/20 rounded-full blur-[80px] -z-10" />
        </div>
    );
}
