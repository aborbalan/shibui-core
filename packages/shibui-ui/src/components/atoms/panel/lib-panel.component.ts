import { LitElement, css, unsafeCSS, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { renderPanel } from './lib-panel.html';
import type { LibPanelVariant, LibPanelPadding } from './lib-panel.types';
import componentCss from './lib-panel.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

/**
 * `<lib-panel>` — Contenedor de superficie para agrupar secciones de UI.
 *
 * Superficie neutra que consume tokens semánticos (`--bg-surface`,
 * `--border-subtle`, `--text-primary`), por lo que hereda el katachi del
 * ancestro automáticamente sin props de contexto. Ofrece cabecera y pie
 * opcionales vía slots.
 *
 * @tag lib-panel
 *
 * @attr {'surface'|'elevated'|'outline'} variant  Tratamiento visual. Default `'surface'`.
 * @attr {'none'|'sm'|'md'|'lg'} padding            Padding interno. Default `'md'`.
 * @attr {string} heading                           Título opcional en la cabecera.
 *
 * @slot           - Contenido principal del panel.
 * @slot header    - Contenido de cabecera (acciones, etc.). Se muestra junto al `heading`.
 * @slot footer    - Contenido de pie (acciones, metadata).
 *
 * @csspart panel  - El contenedor `<section>` raíz.
 * @csspart header - La cabecera.
 * @csspart title  - El título generado desde `heading`.
 * @csspart body   - El cuerpo con el slot por defecto.
 * @csspart footer - El pie.
 *
 * @example
 * <lib-panel heading="Ajustes" variant="elevated">
 *   <p>Contenido del panel…</p>
 *   <div slot="footer"><lib-button size="sm">Guardar</lib-button></div>
 * </lib-panel>
 */
@customElement('lib-panel')
export class LibPanel extends LitElement {

  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(componentCss)}`,
  ];

  /** Tratamiento visual de la superficie. */
  @property({ type: String, reflect: true })
  variant: LibPanelVariant = 'surface';

  /** Padding interno del panel. */
  @property({ type: String, reflect: true })
  padding: LibPanelPadding = 'md';

  /** Título opcional renderizado en la cabecera. */
  @property({ type: String })
  heading = '';

  /** @internal Hay contenido en el slot `header`. */
  @state() hasHeaderSlot = false;

  /** @internal Hay contenido en el slot `footer`. */
  @state() hasFooterSlot = false;

  onHeaderSlotChange(): void {
    this.hasHeaderSlot = this._slotHasContent('header');
  }

  onFooterSlotChange(): void {
    this.hasFooterSlot = this._slotHasContent('footer');
  }

  private _slotHasContent(name: string): boolean {
    const slot = this.renderRoot.querySelector<HTMLSlotElement>(`slot[name="${name}"]`);
    if (!slot) return false;
    return slot.assignedNodes({ flatten: true }).some(
      (n) => n.nodeType === Node.ELEMENT_NODE || (n.textContent ?? '').trim().length > 0,
    );
  }

  protected override render(): TemplateResult {
    return renderPanel(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-panel': LibPanel;
  }
}
