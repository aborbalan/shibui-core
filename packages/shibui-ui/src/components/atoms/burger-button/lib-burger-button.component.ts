import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { burgerTemplate } from './lib-burger-button.html';
import burgerCss from './lib-burger-button.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import type { BurgerVariant, BurgerSize } from './lib-burger-button.types';

/**
 * lib-burger — Botón hamburguesa Shibui (SG-48)
 *
 * @prop variant   — 'ink' | 'kanji' | 'washi' | 'framed' | 'kintsugi' | 'glitch'
 * @prop size      — 'sm' | 'md' | 'lg'
 * @prop open      — estado abierto/cerrado (refleja en atributo)
 * @prop label     — texto opcional junto al botón ('menú' / labelOpen)
 * @prop labelOpen — texto en estado abierto (default: 'cerrar')
 * @prop ariaLabel — aria-label del button (default: 'Menú')
 *
 * @fires ui-lib-burger-change — { detail: { open: boolean } }
 */
@customElement('lib-burger')
export class LibBurger extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(burgerCss)}`,
  ];

  @property({ type: String, reflect: true })
  variant: BurgerVariant = 'ink';

  @property({ type: String, reflect: true })
  size: BurgerSize = 'md';

  @property({ type: Boolean, reflect: true })
  open = false;

  /** Texto junto al botón — si está vacío no se renderiza */
  @property({ type: String })
  label = '';

  /** Texto del label en estado abierto */
  @property({ type: String, attribute: 'label-open' })
  labelOpen = 'cerrar';

  @property({ type: String, attribute: 'aria-label' })
  override ariaLabel = 'Menú';

  /* Texto reactivo del label */
  @state()
  _labelText = '';

  @query('.burger')
  declare private _btn: HTMLButtonElement | null;

  /* Scramble timeout para glitch */
  private _scrambleTimer = 0;

  override connectedCallback(): void {
    super.connectedCallback();
    this._labelText = this.label;
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has('open') && this.label) {
      this._labelText = this.open ? this.labelOpen : this.label;
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    clearTimeout(this._scrambleTimer);
  }

  /* ── Toggle principal ── */
  _handleClick(): void {
    if (this.variant === 'glitch') {
      this._glitchToggle();
    } else {
      this._toggle();
    }
  }

  private _toggle(): void {
    this.open = !this.open;
    this._emit();
  }

  /* Glitch: scramble 320ms antes de resolver */
  private _glitchToggle(): void {
    const btn = this._btn;
    if (!btn) return;

    btn.classList.add('is-scrambling');
    clearTimeout(this._scrambleTimer);

    this._scrambleTimer = window.setTimeout((): void => {
      btn.classList.remove('is-scrambling');
      this._toggle();
    }, 340);
  }

  private _emit(): void {
    this.dispatchEvent(new CustomEvent('ui-lib-burger-change', {
      detail: { open: this.open },
      bubbles: true,
      composed: true,
    }));
  }

  protected override render(): TemplateResult {
    return burgerTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-burger': LibBurger;
  }
}