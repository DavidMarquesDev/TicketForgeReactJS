import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { AuthService } from '../../application/auth.service';
import type { AuthUser } from '../../domain/auth.types';
import { AuthApiRepository } from '../../infrastructure/auth-api.repository';
import { AuthContext, type AuthContextValue } from './auth-context-value';

const authService = new AuthService(new AuthApiRepository());

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        authService
            .bootstrap()
            .then((authenticatedUser) => setUser(authenticatedUser))
            .finally(() => setIsLoading(false));
    }, []);

    const contextValue = useMemo<AuthContextValue>(
        () => ({
            user,
            isAuthenticated: !!user,
            isLoading,
            login: async (payload) => {
                const authenticatedUser = await authService.login(payload);
                setUser(authenticatedUser);
            },
            register: async (payload) => authService.register(payload),
            logout: async () => {
                await authService.logout();
                setUser(null);
            },
        }),
        [isLoading, user],
    );

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
