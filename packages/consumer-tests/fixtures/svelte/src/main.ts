import { mount } from 'svelte';

// Inyecta tokens CSS (paleta + semánticos + katachi) en el documento.
// DEBE ir antes de '@shibui-ui/ui': los módulos ESM se evalúan en orden
// de declaración, así que la inyección del <style> ocurre antes de que
// customElements.define() sea llamado. Esto garantiza que --katachi-id
// ya esté en el CSSOM cuando Playwright compruebe getComputedStyle.
import '@shibui-ui/ui/tokens';
// Registra todos los custom elements de la librería.
// Prerequisito: pnpm build:shibui (dist/ debe existir).
import '@shibui-ui/ui';

import App from './App.svelte';

// Inicializa el registro de eventos capturados — leído por los tests de Playwright.
(window as Record<string, unknown>)['__capturedEvents__'] = {};

mount(App, { target: document.getElementById('app')! });
