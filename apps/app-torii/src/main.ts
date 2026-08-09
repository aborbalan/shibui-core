// ─────────────────────────────────────────────────────────────────────────
// PLOMERÍA — esto ya está hecho (no hace falta tocarlo).
// Importar el barrel de @shibui-ui/ui registra TODOS los web components
// (lib-button, lib-card, …) como custom elements. Los tokens dan el sistema
// de diseño (colores, espacios) que leen los componentes vía variables CSS.
// ─────────────────────────────────────────────────────────────────────────
import '@shibui-ui/ui';
import '@shibui-ui/ui/tokens';
import './styles.css';

// ═════════════════════════════════════════════════════════════════════════
// HITO 1 — TU CÓDIGO EMPIEZA AQUÍ 👇
// ═════════════════════════════════════════════════════════════════════════
//
// Objetivo: arrancar Open Cells con UNA ruta (`/` → home-page).
//
// TODO(H1.1): importa `startApp` de '@open-cells/core' y `routes` de
//   './router/routes'.
// TODO(H1.2): llama a startApp({ routes, mainNode: 'app-content' }).
//   Pista: `mainNode` debe ser el id del <app-index> de index.html.
// TODO(H1.3): en ./router/routes.ts define la ruta `/` que importa la página.
// TODO(H1.4): crea src/pages/home/home-page.ts (LitElement con PageController)
//   que renderice un <h1> y un <lib-button tone="accent">.
//
// Cuando termines: `pnpm start:opencells` debe mostrar la home con el botón
// shibui ya estilado. Avísame y reviso el código + tu primer post de LinkedIn.
