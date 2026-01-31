import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User as UserIcon, Shield, Save, BadgeCheck, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';


// Predefined avatar seeds for the "notionists" style (clean, illustrated style)
const AVATAR_SEEDS = [
    'Felix', 'Aneka', 'Rhea', 'Dieter', 'Jocelyn', 'Marius', 'Caleb', 'Simba'
];

export default function SettingsPage() {
    const { user, updateProfile, changePassword, deleteAccount } = useAuth();

    // Profile State
    const [nickname, setNickname] = useState('');
    const [selectedAvatarSeed, setSelectedAvatarSeed] = useState('');

    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // Account Deletion State
    const [deletePassword, setDeletePassword] = useState('');

    const [profileSaved, setProfileSaved] = useState(false);
    const [securityMsg, setSecurityMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Initialize state from user context when it loads
    useEffect(() => {
        if (user) {
            setNickname(user.nickname || user.name);
            // Extract seed from URL if possible, or just default to empty
            const match = user.avatar?.match(/seed=([^&]*)/);
            if (match) setSelectedAvatarSeed(match[1]);
        }
    }, [user]);

    const handleSaveProfile = () => {
        if (user && nickname) {
            const avatarUrl = selectedAvatarSeed
                ? `https://api.dicebear.com/7.x/notionists/svg?seed=${selectedAvatarSeed}`
                : user.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${nickname}`;

            updateProfile(nickname, avatarUrl);
            setProfileSaved(true);
            setTimeout(() => setProfileSaved(false), 2000);
        }
    };

    const handleChangePassword = async () => {
        setSecurityMsg(null);
        try {
            await changePassword(currentPassword, newPassword);
            setSecurityMsg({ type: 'success', text: 'Password updated successfully.' });
            setCurrentPassword('');
            setNewPassword('');
        } catch (err: any) {
            setSecurityMsg({ type: 'error', text: err.message || 'Failed to update password.' });
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure? This action cannot be undone.")) return;

        try {
            await deleteAccount(deletePassword);
            // User will be logged out automatically
        } catch (err: any) {
            alert(err.message || 'Failed to delete account.');
        }
    };

    if (!user) return null;

    return (
        <div className="container mx-auto p-8 pt-24 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your personal account details and security
                </p>
            </div>

            <div className="space-y-8">

                {/* 1. Account Details (Read Only) */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                        <BadgeCheck className="w-5 h-5 text-blue-500" />
                        <h2 className="text-xl font-semibold">Account Details</h2>
                    </div>
                    {/* Simplified Layout: No background, just clean text */}
                    <div className="px-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <Label className="text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider font-semibold">Full Name</Label>
                                <p className="text-muted-foreground mt-1">{user.name}</p>
                            </div>
                            <div>
                                <Label className="text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider font-semibold">Email Address</Label>
                                <p className="text-muted-foreground mt-1">{user.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Public Profile (Nickname & Avatar) */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                        <UserIcon className="w-5 h-5 text-zinc-500" />
                        <h2 className="text-xl font-semibold">Public Profile</h2>
                    </div>

                    <div className="p-6 rounded-xl border shadow-sm border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="nickname" className="dark:text-white">Display Nickname</Label>
                                <Input
                                    id="nickname"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    placeholder="How you want to be seen"
                                    className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                                />
                                <p className="text-xs text-muted-foreground">This is how your name will appear in the workspace.</p>
                            </div>

                            <div className="space-y-3">
                                <Label className="dark:text-white">Choose Avatar</Label>
                                <div className="flex flex-wrap gap-4">
                                    {AVATAR_SEEDS.map((seed) => (
                                        <button
                                            key={seed}
                                            onClick={() => setSelectedAvatarSeed(seed)}
                                            className={cn(
                                                "relative rounded-full p-1 transition-all hover:scale-105",
                                                selectedAvatarSeed === seed
                                                    ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-zinc-950 bg-blue-50 dark:bg-blue-900/20"
                                                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                            )}
                                        >
                                            <Avatar className="h-12 w-12 border border-zinc-200 dark:border-zinc-700">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`} />
                                                <AvatarFallback>{seed[0]}</AvatarFallback>
                                            </Avatar>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button
                                onClick={handleSaveProfile}
                                className="bg-gradient-to-r from-[#CEE1EA] to-[#3C83EB] text-blue-950 border-none hover:opacity-90 transition-opacity"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {profileSaved ? "Saved!" : "Update Profile"}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 3. Security (Change Password) */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                        <Shield className="w-5 h-5 text-zinc-500" />
                        <h2 className="text-xl font-semibold">Security</h2>
                    </div>

                    <div className="p-6 rounded-xl border shadow-sm border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                        <div className="space-y-4 max-w-md">
                            <div className="space-y-2">
                                <Label htmlFor="current-pass">Current Password</Label>
                                <Input
                                    id="current-pass"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-pass">New Password</Label>
                                <Input
                                    id="new-pass"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                                />
                            </div>

                            {securityMsg && (
                                <p className={cn("text-sm", securityMsg.type === 'success' ? "text-green-600" : "text-red-500")}>
                                    {securityMsg.text}
                                </p>
                            )}

                            <Button
                                onClick={handleChangePassword}
                                className="bg-gradient-to-r from-[#CEE1EA] to-[#3C83EB] text-blue-950 border-none hover:opacity-90 transition-opacity"
                            >
                                <Lock className="w-4 h-4 mr-2" />
                                Change Password
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 4. Danger Zone */}
                <div className="p-6 rounded-xl border border-red-100 dark:border-red-900/20 bg-red-50/50 dark:bg-red-950/10">
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium text-red-900 dark:text-red-200">Delete Account</h3>
                            <p className="text-sm text-red-600/80 dark:text-red-400/70">
                                Permanently delete your account and all associated data. This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex items-end gap-4 max-w-md">
                            <div className="space-y-2 flex-grow">
                                <Label htmlFor="delete-confirm" className="text-red-900 dark:text-red-200">Confirm Password</Label>
                                <Input
                                    id="delete-confirm"
                                    type="password"
                                    placeholder="Enter password to confirm"
                                    value={deletePassword}
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                    className="border-red-200 focus-visible:ring-red-500 bg-white dark:bg-red-950/20 text-red-900 dark:text-red-200 placeholder:text-red-300 dark:placeholder:text-red-700/50"
                                />
                            </div>
                            <Button
                                onClick={handleDeleteAccount}
                                variant="destructive"
                                disabled={!deletePassword}
                            >
                                Delete Account
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
