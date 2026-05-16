import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import canvasStyles from './lib-canvas.css?inline';
import { libCanvasTemplate } from './lib-canvas.html';
import type { KatachiId } from '../../../../models/ui/common';

export type LibCanvasDisplay = 'contents' | 'block' | 'flex';
export type LibCanvasPad = '' | 'lg' | 'xl' | '2xl';

/**
 * `<lib-canvas>` — wrapper que activa un katachi (形) en su subárbol.
 *
 * El atributo `katachi` se refleja como `data-katachi` en el host;
 * las custom properties definidas en `_katachi.css` se propagan a
 * todos los hijos (atraviesan Shadow DOM por herencia).
 *
 * @example
 *   <lib-canvas katachi="kintsugi" display="block" pad="xl">
 *     <lib-card>…</lib-card>
 *   </lib-canvas>
 */
@customElement('lib-canvas')
export class LibCanvas extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(canvasStyles)}`,
  ];

  @property({ type: String, reflect: true })
  katachi: KatachiId | '' = '';

  @property({ type: String, reflect: true })
  display: LibCanvasDisplay = 'contents';

  @property({ type: String, reflect: true })
  pad: LibCanvasPad = '';

  @property({ type: String, reflect: true, attribute: 'min-h' })
  minH: '' | 'screen' = '';

  override willUpdate(changed: Map<string, unknown>): void {
    if (changed.has('katachi')) {
      if (this.katachi) {
        this.setAttribute('data-katachi', this.katachi);
      } else {
        this.removeAttribute('data-katachi');
      }
    }
  }

  protected override render(): TemplateResult {
    return libCanvasTemplate();
  }
}
