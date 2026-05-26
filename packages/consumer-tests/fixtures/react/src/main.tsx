import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Registra todos los custom elements de la librería.
// Prerequisito: pnpm build:shibui (dist/ debe existir).
import '@shibui-ui/ui';
// Inyecta tokens CSS (paleta + semánticos + katachi) en el documento.
// Sin este import, las CSS custom properties del sistema Katachi (--katachi-id,
// --bg-base, etc.) no estarían disponibles para herencia en los tests.
import '@shibui-ui/ui/tokens';

import App from './App';

// Inicializa el registro de eventos capturados — leído por los tests de Playwright.
(window as Record<string, unknown>)['__capturedEvents__'] = {};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
