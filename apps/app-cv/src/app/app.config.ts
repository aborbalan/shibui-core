import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from '../routes/app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // La app no carga zone.js (no está en polyfills) y es 100% signals →
    // CD zoneless. Sin esto, ningún evento actualiza la vista (p. ej. el
    // drawer de Skills no abría al hacer clic).
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
  ],
};
