// Importar el barrel de @shibui-ui/ui registra todos los web components
// (lib-header, lib-card, …) como custom elements; los tokens dan el sistema de
// diseño que esos componentes leen por variables CSS.
import '@shibui-ui/ui';
import '@shibui-ui/ui/tokens';
import './styles.css';

import { startApp } from '@open-cells/core';
import { routes } from './router/routes';

// El orden importa: el shell instancia un ElementController, que necesita el
// bridge ya montado. `startApp` es síncrono, así que basta con arrancarlo antes
// de que el módulo del shell se evalúe — de ahí el import dinámico de abajo.
startApp({ routes, mainNode: 'app-content' });

await import('./chrome/torii-chrome.component');
