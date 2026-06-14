import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../atoms/icon/lib-icon.component';
import '../../atoms/close-button/lib-close-button.component';
import { gadgetFrameTemplate }    from './lib-gadget-frame.html';
import componentCss               from './lib-gadget-frame.css?inline';
import sharedTokens               from '../../../styles/shared/tokens.css?inline';
import type { GadgetFrameTheme } from './lib-gadget-frame.types';

/**
 * @element lib-gadget-frame
 *
 * Contenedor de gadget para dashboards drag & drop.
 * Envuelve el contenido en un frame con barra de título,
 * icono, controles (minimizar / cerrar) y handle de arrastre.
 *
 * Para integrarlo con react-grid-layout u otros:
 * usa `data-drag-handle` como selector del drag handle.
 *
 * @prop {string}             gadget-title — Nombre del gadget
 * @prop {string}             icon         — Nombre del icono Phosphor
 * @prop {boolean}            minimizable  — Muestra botón minimizar (default: true)
 * @prop {boolean}            closable     — Muestra botón cerrar (default: true)
 * @prop {boolean}            minimized    — Estado minimizado (reflect)
 * @prop {GadgetFrameTheme}   theme        — 'default' (card) | 'glass'
 *
 * @slot — Contenido del gadget (oculto cuando minimized)
 *
 * @fires ui-lib-gadget-minimize — { detail: { minimized: boolean } }
 * @fires ui-lib-gadget-close   — void
 *
 * @example — uso básico (glass)
 * <lib-gadget-frame gadget-title="CPU" icon="cpu">
 *   <p>Contenido del gadget</p>
 * </lib-gadget-frame>
 *
 * @example — tema default (card) sin cierre
 * <lib-gadget-frame gadget-title="Logs" icon="terminal" theme="default" closable="false">
 *   <p>...</p>
 * </lib-gadget-frame>
 */
@customElement('lib-gadget-frame')
export class LibGadgetFrame extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(componentCss)}`,
  ];

  /**
   * Título mostrado en la barra del gadget.
   * Se usa `gadget-title` (no `title`) para evitar conflicto
   * con el atributo nativo HTMLElement.title.
   */
  @property({ type: String, attribute: 'gadget-title' })
  gadgetTitle = '';

  /** Nombre del icono Phosphor que se muestra en el header. */
  @property({ type: String })
  icon = '';

  /** Muestra el botón de minimizar. */
  @property({ type: Boolean, reflect: true })
  minimizable = true;

  /** Muestra el botón de cerrar. */
  @property({ type: Boolean, reflect: true })
  closable = true;

  /** Estado minimizado: oculta el body, solo muestra el header. */
  @property({ type: Boolean, reflect: true })
  minimized = false;

  /** Estética del contenedor: 'default' (card semántico) | 'glass' (glassmorphism). */
  @property({ type: String, reflect: true })
  theme: GadgetFrameTheme = 'default';

  override render(): TemplateResult {
    return gadgetFrameTemplate({
      gadgetTitle: this.gadgetTitle,
      icon:        this.icon,
      minimizable: this.minimizable,
      closable:    this.closable,
      minimized:   this.minimized,
      theme:       this.theme,
      onMinimize:  this._handleMinimize.bind(this),
      onClose:     this._handleClose.bind(this),
    });
  }

  /* ── Handlers ── */

  private _handleMinimize(): void {
    this.minimized = !this.minimized;
    this.dispatchEvent(new CustomEvent<{ minimized: boolean }>('ui-lib-gadget-minimize', {
      detail:   { minimized: this.minimized },
      bubbles:  true,
      composed: true,
    }));
  }

  private _handleClose(): void {
    this.dispatchEvent(new CustomEvent('ui-lib-gadget-close', {
      bubbles:  true,
      composed: true,
    }));
  }

  /* ── API pública ── */

  /** Alterna minimizado ↔ expandido. */
  toggle(): void { this._handleMinimize(); }

  /** Colapsa el gadget al header. No dispara evento si ya estaba minimizado. */
  minimize(): void { if (!this.minimized) this._handleMinimize(); }

  /** Expande el gadget. No dispara evento si ya estaba expandido. */
  expand(): void { if (this.minimized) this._handleMinimize(); }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-gadget-frame': LibGadgetFrame;
  }
}
