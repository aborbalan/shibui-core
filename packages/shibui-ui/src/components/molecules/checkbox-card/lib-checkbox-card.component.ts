import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { checkboxCardTemplate } from './lib-checkbox-card.html';
import checkboxCardCss from './lib-checkbox-card.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import type {
  CheckboxCardColor,
  CheckboxCardLayout,
  CheckboxCardInputType,
} from './lib-checkbox-card.types';

/**
 * lib-checkbox-card — Tarjeta seleccionable Shibui (SG-57)
 *
 * La mecánica de checked se gestiona con CSS puro vía
 * `input:checked ~ .cc-body`. El componente solo gestiona
 * el estado, el ripple y los eventos.
 *
 * @prop checked      — Estado checked (refleja en atributo)
 * @prop input-type   — 'checkbox' | 'radio'
 * @prop name         — Nombre del grupo (requerido en radio)
 * @prop value        — Valor del input
 * @prop color        — 'kaki' | 'celadon'
 * @prop layout       — 'vertical' | 'horizontal' | 'compact'
 * @prop card-title   — Título (alternativa a slot)
 * @prop desc         — Descripción (alternativa a slot)
 * @prop check-shape  — 'square' | 'pill'
 * @prop dark         — Surface oscura
 * @prop disabled     — Estado deshabilitado
 * @prop error        — Estado de error
 * @prop image        — Modo imagen (sin padding en .cc-body)
 *
 * @fires ui-lib-checkbox-card-change — { detail: { checked: boolean, value: string } }
 *
 * @slot icon     — Icono SVG o imagen
 * @slot badge    — Badge/etiqueta
 * @slot title    — Título (sobreescribe card-title prop)
 * @slot desc     — Descripción (sobreescribe desc prop)
 * @slot price    — Bloque de precio
 * @slot divider  — Línea divisoria
 * @slot features — Lista de características
 * @slot image    — Imagen con aspect-ratio 16/9
 * @slot          — Contenido libre
 */
@customElement('lib-checkbox-card')
export class LibCheckboxCard extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(checkboxCardCss)}`,
  ];

  @property({ type: Boolean, reflect: true })
  checked = false;

  @property({ type: String, reflect: true, attribute: 'input-type' })
  inputType: CheckboxCardInputType = 'checkbox';

  @property({ type: String })
  name = '';

  @property({ type: String })
  value = '';

  @property({ type: String, reflect: true })
  color: CheckboxCardColor = 'kaki';

  @property({ type: String, reflect: true })
  layout: CheckboxCardLayout = 'vertical';

  @property({ type: String, attribute: 'card-title' })
  cardTitle = '';

  @property({ type: String })
  desc = '';

  @property({ type: String, attribute: 'check-shape' })
  checkShape: 'square' | 'pill' = 'square';

  @property({ type: Boolean, reflect: true })
  dark = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  error = false;

  @property({ type: Boolean, reflect: true })
  image = false;

  @query('.cc-ripple')
  declare private _rippleEl: HTMLElement | null;

  /* ── Ripple en click ── */
  _handleClick(e: MouseEvent): void {
    if (this.disabled) return;
    this._spawnRipple(e);
  }

  private _spawnRipple(e: MouseEvent): void {
    const ripple = this._rippleEl;
    if (!ripple) return;

    const rect = ripple.getBoundingClientRect();
    const dot = document.createElement('span');
    dot.className = 'cc-ripple-dot';
    dot.style.left = `${e.clientX - rect.left - 2}px`;
    dot.style.top  = `${e.clientY - rect.top  - 2}px`;
    ripple.appendChild(dot);
    dot.addEventListener('animationend', (): void => dot.remove(), { once: true });
  }

  /* ── Cambio de estado ── */
  _handleChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    this.checked = input.checked;
    this.dispatchEvent(new CustomEvent('ui-lib-checkbox-card-change', {
      detail: { checked: this.checked, value: this.value },
      bubbles: true,
      composed: true,
    }));
  }

  /* Helper para detectar slots con contenido */
  _hasSlot(name: string): boolean {
    return !!this.querySelector(`[slot="${name}"]`);
  }

  protected override render(): TemplateResult {
    return checkboxCardTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-checkbox-card': LibCheckboxCard;
  }
}