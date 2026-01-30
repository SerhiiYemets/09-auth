'use client';

import { checkSession, getMe } from '../../lib/api/clientApi';
import { useUserAuthStore } from '../../lib/store/authStore';
import { useEffect } from 'react';

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const setAuth = useUserAuthStore(state => state.setUser);
    const clearIsAuth = useUserAuthStore(state => state.clearIsAuthenticated);

    useEffect(() => {
        const fetchSession = async () => {
        const response = await checkSession();
        if (response) {
            const user = await getMe();
            setAuth(user);
        } else {
            clearIsAuth();
        }
        };
        fetchSession();
    }, [setAuth, clearIsAuth]);

    return children;
};

export default AuthProvider;