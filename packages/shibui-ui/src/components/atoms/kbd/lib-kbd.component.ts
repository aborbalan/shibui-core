import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { kbdTemplate } from './lib-kbd.html';
import kbdCss from './lib-kbd.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

export type LibKbdSize    = 'xs' | 'sm' | 'md' | 'lg';
export type LibKbdVariant = 'default' | 'dark' | 'ghost' | 'kaki' | 'celadon';

/**
 * @element lib-kbd
 *
 * Representa una tecla de teclado física.
 * El `border-bottom` de 3px simula la pared lateral de la tecla.
 * El estado `pressed` produce un desplazamiento físico de 1-2px.
 *
 * @slot (default) — el símbolo o texto de la tecla (⌘, K, Ctrl…)
 *
 * @example — tecla individual
 * <lib-kbd>⌘</lib-kbd>
 *
 * @example — combo (el consumer compone las teclas)
 * <lib-kbd size="sm">⌘</lib-kbd>
 * <span>+</span>
 * <lib-kbd size="sm">K</lib-kbd>
 *
 * @example — pressed programático
 * <lib-kbd pressed>Space</lib-kbd>
 */
@customElement('lib-kbd')
export class LibKbd extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(kbdCss)}`,
  ];

  /** Tamaño de la tecla. */
  @property({ type: String, reflect: true })
  size: LibKbdSize = 'md';

  /** Variante visual de color. */
  @property({ type: String, reflect: true })
  variant: LibKbdVariant = 'default';

  /**
   * Estado pressed programático.
   * El componente también gestiona pressed internamente
   * via mousedown/mouseup para la interacción del usuario.
   */
  @property({ type: Boolean, reflect: true })
  pressed = false;

  /** Estado interno de pulsación por ratón (no expuesto como atributo). */
  @state()
  private _pointerPressed = false;

  override render(): TemplateResult {
    return kbdTemplate({
      size:    this.size,
      variant: this.variant,
      pressed: this.pressed || this._pointerPressed,
      onDown:  this._onPointerDown.bind(this),
      onUp:    this._onPointerUp.bind(this),
      onLeave: this._onPointerLeave.bind(this),
    });
  }

  private _onPointerDown(): void {
    this._pointerPressed = true;
  }

  private _onPointerUp(): void {
    this._pointerPressed = false;
  }

  private _onPointerLeave(): void {
    this._pointerPressed = false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-kbd': LibKbd;
  }
}