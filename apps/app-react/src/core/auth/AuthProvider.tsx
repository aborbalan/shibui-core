import { useState } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';

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