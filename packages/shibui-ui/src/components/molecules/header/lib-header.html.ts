import { TemplateResult } from 'lit';
import type { LibHeader } from './lib-header.component';

import { renderClassic  } from './templates/header-classic.html';
import { renderCentered } from './templates/header-centered.html';
import { renderMega     } from './templates/header-mega.html';
import { renderAppBar   } from './templates/header-app-bar.html';

/**
 * Dispatcher principal del componente lib-header.
 *
 * No contiene lógica de presentación propia.
 * Cada variante vive en su propio fichero dentro de /templates.
 *
 * Variantes → fichero
 * ───────────────────────────────────────────────────────────
 * classic · dark · transparent · kintsugi
 * glitch · minimal · shrink              → header-classic.html.ts
 * centered                               → header-centered.html.ts
 * mega                                   → header-mega.html.ts
 * app-bar                                → header-app-bar.html.ts
 *
 * Helpers compartidos (logo, links, actions, SVGs) → header-shared.html.ts
 * Móvil (hamburger + drawer)                       → header-mobile.html.ts
 */
export function headerTemplate(ctx: LibHeader): TemplateResult {
  switch (ctx.variant) {
    case 'centered': return renderCentered(ctx);
    case 'mega':     return renderMega(ctx);
    case 'app-bar':  return renderAppBar(ctx);
    default:         return renderClassic(ctx);
  }
}