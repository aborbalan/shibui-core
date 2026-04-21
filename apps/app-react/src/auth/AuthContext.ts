import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface AuthContextValue {
    isAuthenticated: boolean;
    login: (password: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// 🔑 Swap esto por una llamada a API real cuando tengas backend
const ADMIN_PASSWORD = 'shibui-dev';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(
        () => sessionStorage.getItem('admin_auth') === 'true'
    );

    const login = (password: string): boolean => {
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem('admin_auth', 'true');
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        sessionStorage.removeItem('admin_auth');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
    return ctx;
}