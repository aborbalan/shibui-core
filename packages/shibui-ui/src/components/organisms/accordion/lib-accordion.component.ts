import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { accordionTemplate } from './lib-accordion.component.html';
import type { LibAccordionItem } from '../../atoms/accordion-item/lib-accordion-item.component';
import accordionCss from './lib-accordion.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

/** Modo de presentación del accordion (eje `display`). */
export type LibAccordionDisplay = 'default' | 'flush' | 'separated';
/** Tinte semántico (subconjunto canónico de `LibTone`). */
export type LibAccordionTone    = 'default' | 'accent';

/**
 * @element lib-accordion
 *
 * Organismo que orquesta uno o varios lib-accordion-item.
 * Gestiona el modo exclusive y aplica variantes visuales
 * sobre los items via la API de CSS custom properties.
 *
 * @slot - lib-accordion-item elements
 *
 * @example
 * <lib-accordion tone="accent" exclusive>
 *   <lib-accordion-item label="Pregunta 1">Respuesta 1</lib-accordion-item>
 *   <lib-accordion-item label="Pregunta 2" open>Respuesta 2</lib-accordion-item>
 * </lib-accordion>
 */
@customElement('lib-accordion')
export class LibAccordion extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(accordionCss)}`,
  ];

  /** Modo de presentación (default · flush · separated) */
  @property({ type: String, reflect: true })
  display: LibAccordionDisplay = 'default';

  /** Tinte semántico (default · accent) */
  @property({ type: String, reflect: true })
  tone: LibAccordionTone = 'default';

  /**
   * Si true, solo un item puede estar abierto a la vez.
   * Al abrir uno, los demas se cierran automaticamente.
   */
  @property({ type: Boolean })
  exclusive = false;

  private _handleToggle(e: Event): void {
    if (!this.exclusive) return;

    const target = e.target as LibAccordionItem;

    // Solo actuamos si el item se acaba de abrir
    if (!target.open) return;

    const items = Array.from(
      this.querySelectorAll<LibAccordionItem>('lib-accordion-item')
    );

    items.forEach(item => {
      if (item !== target) {
        item.open = false;
      }
    });
  }

  override render(): TemplateResult {
    return accordionTemplate({
      onToggle: this._handleToggle.bind(this),
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-accordion': LibAccordion;
  }
}