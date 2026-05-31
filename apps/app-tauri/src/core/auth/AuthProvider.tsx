import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';

const AUTH_KEY = 'admin_auth';
const PASSWORD = 'shibui-dev';

/**
 * Auth en localStorage (no sessionStorage) para que el estado de sesión se
 * comparta entre todas las ventanas del macro entorno. El listener `storage`
 * propaga login/logout hecho en una ventana al resto en vivo.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  });

  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === AUTH_KEY) {
        setIsAuthenticated(e.newValue === 'true');
      }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const login = (password: string): boolean => {
    if (password === PASSWORD) {
      localStorage.setItem(AUTH_KEY, 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
