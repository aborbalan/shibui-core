import { mount } from 'svelte';

// Registra todos los custom elements de la librería.
// Prerequisito: pnpm build:shibui (dist/ debe existir).
import '@shibui-ui/ui';
// Inyecta tokens CSS (paleta + semánticos + katachi) en el documento.
import '@shibui-ui/ui/tokens';

import App from './App.svelte';

// Inicializa el registro de eventos capturados — leído por los tests de Playwright.
(window as Record<string, unknown>)['__capturedEvents__'] = {};

mount(App, { target: document.getElementById('app')! });
