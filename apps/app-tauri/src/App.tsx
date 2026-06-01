import { useEffect, useRef } from 'react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { AppShell } from './shell/AppShell';
import { AuthProvider } from './core/auth/AuthProvider';
import { useAuth } from './core/hooks/useAuth';
import { LibCanvas } from '@shibui-ui/ui/react';

/** Ruta inicial por ventana del macro entorno, según su `label` de Tauri. */
const WINDOW_ROUTES: Record<string, string> = {
  secondary: '/workspace',
};

/**
 * Lleva cada ventana a su sección inicial según el label de Tauri (p.ej. la
 * ventana `secondary` arranca en /workspace). Solo redirige una vez, en cuanto
 * hay sesión, para no pisar la navegación posterior del usuario.
 */
function WindowInitializer() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const done = useRef(false);

  useEffect(() => {
    if (done.current || !isAuthenticated) return;

    let label: string | undefined;
    try {
      // En `pnpm dev` (sin runtime Tauri) getCurrentWindow() lanza; lo ignoramos.
      label = getCurrentWindow().label;
    } catch {
      label = undefined;
    }

    const target = label ? WINDOW_ROUTES[label] : undefined;
    if (target) {
      done.current = true;
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return null;
}

function App() {
  return (
    <MemoryRouter>
      <AuthProvider>
        <LibCanvas katachi="terminal">
          <WindowInitializer />
          <AppShell />
        </LibCanvas>
      </AuthProvider>
    </MemoryRouter>
  );
}

export default App;
