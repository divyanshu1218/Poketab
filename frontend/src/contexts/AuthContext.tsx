import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/authService';
import type { User, LoginRequest, RegisterRequest } from '@/types/auth.types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check if user is authenticated on mount
    useEffect(() => {
        const initAuth = async () => {
            if (authService.isAuthenticated()) {
                try {
                    const userData = await authService.getCurrentUser();
                    setUser(userData);
                } catch (err) {
                    console.error('Failed to get current user:', err);
                    authService.logout();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (data: LoginRequest) => {
        try {
            setError(null);
            setLoading(true);
            console.log('Attempting login with:', { email: data.email });
            await authService.login(data);
            const userData = await authService.getCurrentUser();
            setUser(userData);
            console.log('Login successful');
        } catch (err: any) {
            console.error('Login error:', err);
            const message = err.response?.data?.detail || err.message || 'Login failed';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: RegisterRequest) => {
        try {
            setError(null);
            setLoading(true);
            console.log('Attempting registration with:', { email: data.email, username: data.username });
            await authService.register(data);
            console.log('Registration successful, attempting auto-login');
            // Auto-login after registration
            await login({ email: data.email, password: data.password });
        } catch (err: any) {
            console.error('Registration error:', err);
            const message = err.response?.data?.detail || err.message || 'Registration failed';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
