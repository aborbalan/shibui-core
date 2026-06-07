import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { AppComponent } from './app/app';

// Registra todos los custom elements de la librería.
// Prerequisito: pnpm build:shibui (dist/ debe existir).
import '@shibui-ui/ui';

// Inicializa el registro de eventos capturados — leído por los tests de Playwright.
(window as unknown as Record<string, unknown>)['__capturedEvents__'] = {};

// Zoneless explícito: el fixture no incluye zone.js y todo su estado es signal
// (sin setTimeout/Promise/subscribe). Declararlo deja la intención clara, lo hace
// robusto ante defaults de Angular y silencia warnings. El CD lo disparan signals
// + event bindings — sin monkey-patching. La librería (Lit) es agnóstica al CD.
bootstrapApplication(AppComponent, {
  providers: [provideZonelessChangeDetection()],
}).catch(err => console.error(err));
