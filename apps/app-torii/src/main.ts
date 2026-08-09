// Importar el barrel de @shibui-ui/ui registra todos los web components
// (lib-header, lib-card, …) como custom elements; los tokens dan el sistema de
// diseño que esos componentes leen por variables CSS.
import '@shibui-ui/ui';
import '@shibui-ui/ui/tokens';
import './styles.css';

import { startApp } from '@open-cells/core';
import { routes } from './router/routes';
import { loadTrustReport } from './data/loaders/trust-report.loader';
import { loadCatalog } from './data/loaders/catalog.loader';
import { loadDeploys } from './data/loaders/deploys.loader';

// El orden importa: el shell instancia un ElementController, que necesita el
// bridge ya montado. `startApp` es síncrono, así que basta con arrancarlo antes
// de que el módulo del shell se evalúe — de ahí el import dinámico de abajo.
startApp({ routes, mainNode: 'app-content' });

await import('./chrome/torii-chrome.component');

// Los loaders publican en sus channels y nadie los espera: los channels
// reproducen su último valor, así que una página que se monte después recibe
// el dato igual. Si uno falla, publica su valor de repuesto y ya está — la
// navegación no se bloquea por una API dormida.
void loadTrustReport();
void loadCatalog();
void loadDeploys();
