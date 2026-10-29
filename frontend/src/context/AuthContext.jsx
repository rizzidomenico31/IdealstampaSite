import { useEffect, useState, useCallback } from 'react';
import { adminApi, getToken, setToken, clearToken } from '../services/api';
import { AuthContext } from './authContext';

export function AuthProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    const [status, setStatus] = useState('idle'); // idle | loading | authenticated | unauthenticated

    const logout = useCallback(async ({ silent = false } = {}) => {
        if (!silent) {
            try { await adminApi.logout(); } catch { /* best effort */ }
        }
        clearToken();
        setAdmin(null);
        setStatus('unauthenticated');
    }, []);

    // Riconcilia lo stato con il token al mount + intercetta token scaduti
    useEffect(() => {
        const token = getToken();
        if (!token) {
            setStatus('unauthenticated');
            return;
        }
        setStatus('loading');
        adminApi.me()
            .then(res => {
                setAdmin(res.admin);
                setStatus('authenticated');
            })
            .catch(() => {
                clearToken();
                setAdmin(null);
                setStatus('unauthenticated');
            });
    }, []);

    useEffect(() => {
        const onExpired = () => { logout({ silent: true }); };
        window.addEventListener('auth:expired', onExpired);
        return () => window.removeEventListener('auth:expired', onExpired);
    }, [logout]);

    const login = useCallback(async (username, password) => {
        const res = await adminApi.login(username, password);
        setToken(res.token);
        setAdmin(res.admin);
        setStatus('authenticated');
        return res.admin;
    }, []);

    const value = {
        admin,
        status,
        isAuthenticated: status === 'authenticated',
        isLoading: status === 'loading' || status === 'idle',
        login,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
