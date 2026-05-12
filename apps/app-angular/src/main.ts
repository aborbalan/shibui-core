import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import '@shibui-ui/ui'; // Esto registra todos los custom elements (<lib-button>, etc.

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
