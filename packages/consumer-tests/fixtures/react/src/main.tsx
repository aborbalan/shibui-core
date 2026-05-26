import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Registra todos los custom elements de la librería.
// Prerequisito: pnpm build:shibui (dist/ debe existir).
import '@shibui-ui/ui';

import App from './App';

// Inicializa el registro de eventos capturados — leído por los tests de Playwright.
(window as Record<string, unknown>)['__capturedEvents__'] = {};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
