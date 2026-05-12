import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { accordionItemTemplate } from './lib-accordion-item.component.html';
import accordionItemCss from './lib-accordion-item.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

/**
 * @element lib-accordion-item
 *
 * Item colapsable individual. Puede usarse standalone o dentro de lib-accordion.
 * El padre lib-accordion orquesta el comportamiento mutually-exclusive y
 * aplica variantes (flush, separated, accent) via CSS custom properties.
 *
 * @slot - Contenido colapsable
 *
 * @fires accordion-toggle - Emitido al hacer clic en el trigger.
 *   detail: { open: boolean }
 *
 * @example
 * <lib-accordion-item label="Pregunta" open>
 *   Respuesta detallada aqui.
 * </lib-accordion-item>
 */
@customElement('lib-accordion-item')
export class LibAccordionItem extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(accordionItemCss)}`,
  ];

  /** Texto del trigger (cabecera del item) */
  @property({ type: String })
  label = '';

  /** Estado abierto/cerrado */
  @property({ type: Boolean, reflect: true })
  open = false;

  private _handleToggle(): void {
    this.open = !this.open;

    this.dispatchEvent(
      new CustomEvent<{ open: boolean }>('accordion-toggle', {
        bubbles: true,
        composed: true,
        detail: { open: this.open },
      })
    );
  }

  override render(): TemplateResult {
    return accordionItemTemplate({
      label: this.label,
      open: this.open,
      onToggle: this._handleToggle.bind(this),
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-accordion-item': LibAccordionItem;
  }
}