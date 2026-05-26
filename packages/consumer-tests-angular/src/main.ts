import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';

// Registra todos los custom elements de la librería.
// Prerequisito: pnpm build:shibui (dist/ debe existir).
import '@shibui-ui/ui';

// Inicializa el registro de eventos capturados — leído por los tests de Playwright.
(window as unknown as Record<string, unknown>)['__capturedEvents__'] = {};

bootstrapApplication(AppComponent).catch(err => console.error(err));
