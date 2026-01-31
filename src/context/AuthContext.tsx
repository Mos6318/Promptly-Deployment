import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLibraryStore } from '@/store/libraryStore';

interface User {
    id: string;
    name: string; // Signup Name (Legal/Full Name)
    nickname?: string; // Display Name
    email: string;
    password?: string; // In a real app, never store plain text passwords!
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    updateProfile: (nickname: string, avatar: string) => void;
    changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
    deleteAccount: (password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Sync with library store
    useEffect(() => {
        const store = useLibraryStore.getState();
        if (user) {
            store.initUser(user.id);
        } else {
            store.clearUser();
        }
    }, [user]);

    // Check session on mount
    useEffect(() => {
        const storedSession = localStorage.getItem('promptly_session_user');
        if (storedSession) {
            setUser(JSON.parse(storedSession));
        }
    }, []);

    const getUsers = (): User[] => {
        const users = localStorage.getItem('promptly_users');
        return users ? JSON.parse(users) : [];
    };

    const login = async (email: string, password: string) => {
        setError(null);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const users = getUsers();
        const foundUser = users.find(u => u.email === email && u.password === password);

        if (foundUser) {
            // Don't store password in session
            const { password: _, ...safeUser } = foundUser;
            setUser(safeUser as User);
            localStorage.setItem('promptly_session_user', JSON.stringify(safeUser));
        } else {
            setError('Invalid email or password');
            throw new Error('Invalid email or password');
        }
    };

    const signup = async (name: string, email: string, password: string) => {
        setError(null);
        await new Promise(resolve => setTimeout(resolve, 500));

        const users = getUsers();
        if (users.some(u => u.email === email)) {
            setError('Email already exists');
            throw new Error('Email already exists');
        }

        const newUser: User = {
            id: Date.now().toString(),
            name,
            email,
            password, // Storing purely for simulation purposes
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
        };

        const updatedUsers = [...users, newUser];
        localStorage.setItem('promptly_users', JSON.stringify(updatedUsers));

        // Auto login after signup
        const { password: _, ...safeUser } = newUser;
        setUser(safeUser as User);
        localStorage.setItem('promptly_session_user', JSON.stringify(safeUser));
    };

    const updateProfile = (nickname: string, avatar: string) => {
        if (!user) return;

        const updatedUser = { ...user, nickname, avatar };
        setUser(updatedUser);
        localStorage.setItem('promptly_session_user', JSON.stringify(updatedUser));

        // Also update in the main users list
        const users = getUsers();
        const userIndex = users.findIndex(u => u.email === user.email);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], nickname, avatar };
            localStorage.setItem('promptly_users', JSON.stringify(users));
        }
    };

    const changePassword = async (oldPassword: string, newPassword: string) => {
        if (!user) return;
        setError(null);
        await new Promise(resolve => setTimeout(resolve, 500));

        const users = getUsers();
        const userIndex = users.findIndex(u => u.email === user.email);

        if (userIndex === -1) throw new Error('User not found');

        if (users[userIndex].password !== oldPassword) {
            throw new Error('Incorrect current password');
        }

        users[userIndex].password = newPassword;
        localStorage.setItem('promptly_users', JSON.stringify(users));
    };

    const deleteAccount = async (password: string) => {
        if (!user) return;
        setError(null);
        await new Promise(resolve => setTimeout(resolve, 500));

        const users = getUsers();
        const userIndex = users.findIndex(u => u.email === user.email);

        if (userIndex === -1) throw new Error('User not found');

        if (users[userIndex].password !== password) {
            throw new Error('Incorrect password');
        }

        const newUsers = users.filter((_, index) => index !== userIndex);
        localStorage.setItem('promptly_users', JSON.stringify(newUsers));
        logout();
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('promptly_session_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, updateProfile, changePassword, deleteAccount, logout, isAuthenticated: !!user, error }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
