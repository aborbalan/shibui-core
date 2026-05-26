import { mount } from 'svelte';

// Registra todos los custom elements de la librería.
// Prerequisito: pnpm build:shibui (dist/ debe existir).
import '@shibui-ui/ui';

import App from './App.svelte';

// Inicializa el registro de eventos capturados — leído por los tests de Playwright.
(window as Record<string, unknown>)['__capturedEvents__'] = {};

mount(App, { target: document.getElementById('app')! });
