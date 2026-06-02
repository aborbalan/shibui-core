import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { isMainWindow } from '../windows';

const AUTH_KEY = 'admin_auth';
const PASSWORD = 'shibui-dev';

/**
 * Marca de módulo: garantiza que la purga de arranque se ejecuta UNA sola vez
 * por carga de ventana (cada ventana de Tauri es un contexto JS nuevo).
 */
let startupHandled = false;

/**
 * Resuelve el estado de autenticación inicial.
 *
 * La sesión vive en `localStorage` (no `sessionStorage`) para **compartirse
 * entre las dos ventanas** del macro entorno. Pero `localStorage` persiste
 * entre reinicios, así que para exigir **login en cada arranque** la ventana
 * principal purga la sesión la primera vez que carga. La ventana secundaria
 * (creada tras el login) NO purga, de modo que hereda la sesión recién hecha.
 */
function resolveInitialAuth(): boolean {
  if (!startupHandled && isMainWindow()) {
    startupHandled = true;
    localStorage.removeItem(AUTH_KEY);
    return false;
  }
  return localStorage.getItem(AUTH_KEY) === 'true';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(resolveInitialAuth);

  useEffect(() => {
    // Propaga login/logout hecho en una ventana al resto de ventanas en vivo.
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
