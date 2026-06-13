import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { kbdTemplate } from './lib-kbd.html';
import kbdCss from './lib-kbd.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

export type LibKbdSize    = 'xs' | 'sm' | 'md' | 'lg';
/** Tratamiento visual de la tecla (subconjunto canónico de `LibVariant`). */
export type LibKbdVariant = 'solid' | 'ghost';
/** Superficie de la tecla (subconjunto canónico de `LibSurface`). */
export type LibKbdSurface = 'default' | 'inverse';
/** Tinte semántico de la tecla (subconjunto canónico de `LibTone`). */
export type LibKbdTone    = 'default' | 'accent' | 'info';

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

  /** Tratamiento visual (solid · ghost). */
  @property({ type: String, reflect: true })
  variant: LibKbdVariant = 'solid';

  /** Superficie (default · inverse). */
  @property({ type: String, reflect: true })
  surface: LibKbdSurface = 'default';

  /** Tinte semántico (default · accent · info). */
  @property({ type: String, reflect: true })
  tone: LibKbdTone = 'default';

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
      surface: this.surface,
      tone:    this.tone,
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