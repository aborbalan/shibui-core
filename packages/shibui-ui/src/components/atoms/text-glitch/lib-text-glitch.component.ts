import { LitElement, css, unsafeCSS, TemplateResult, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import glitchCss from './lib-text-glitch.css?inline';
import { textGlitchTemplate } from './lib-text-glitch.html';

/* ── Tipos públicos ─────────────────────────────────────────── */

/** Variante visual del efecto de glitch. */
export type TextGlitchVariant = 'slice' | 'scan' | 'shift' | 'decode' | 'redact' | 'noise';

/**
 * Modo de activación del efecto.
 * - `hover`  → se activa al pasar el cursor (default).
 * - `always` → se activa de forma continua al montar el componente.
 */
export type TextGlitchTrigger = 'hover' | 'always';

/* ── Pool de caracteres para el decode ──────────────────────── */

const KANA =
  'ア イ ウ エ オ カ キ ク ケ コ サ シ ス セ ソ タ チ ツ テ ト ナ ニ ヌ ネ ノ ' +
  'ハ ヒ フ ヘ ホ マ ミ ム メ モ ヤ ユ ヨ ラ リ ル レ ロ ワ ヲ ン ガ ギ グ ゲ ゴ ' +
  'ザ ジ ズ ゼ ゾ ダ ヂ ヅ デ ド バ ビ ブ ベ ボ 渋 液 美 乱 進 間 静 陰 影 黒 白 墨 和 侘'.split(' ');

/**
 * @element lib-text-glitch
 *
 * @prop {string}              text    - Texto a renderizar y distorsionar.
 * @prop {TextGlitchVariant}   variant - Efecto visual: slice | scan | shift | decode | redact | noise.
 * @prop {TextGlitchTrigger}   trigger - Modo de activación: hover | always.
 * @prop {boolean}             active  - Activa el efecto programáticamente (reflectado en atributo).
 *
 * @method play()  - Reproduce el efecto una vez (scan / redact / decode).
 * @method stop()  - Detiene el bucle `trigger="always"`.
 */
@customElement('lib-text-glitch')
export class LibTextGlitch extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(glitchCss)}`,
  ];

  /* ── Props ──────────────────────────────────────────────── */

  @property({ type: String })
  text: string = '';

  @property({ type: String, reflect: true })
  variant: TextGlitchVariant = 'slice';

  @property({ type: String, reflect: true })
  trigger: TextGlitchTrigger = 'hover';

  /** Activa el efecto desde el exterior (CSS reacciona a [active]). */
  @property({ type: Boolean, reflect: true })
  active: boolean = false;

  /* ── Estado interno ─────────────────────────────────────── */

  private _running = false;
  private _alwaysTimer?: ReturnType<typeof setTimeout>;

  /* Bound handler reutilizable para poder hacer removeEventListener */
  private readonly _boundMouseEnter = (): void => { this._decodePlay(); };

  /* ── Lifecycle ──────────────────────────────────────────── */

  override connectedCallback(): void {
    super.connectedCallback();
    this._setupDecode();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('mouseenter', this._boundMouseEnter);
    clearTimeout(this._alwaysTimer);
  }

  override updated(changed: PropertyValues): void {
    const reInit =
      changed.has('variant') ||
      changed.has('trigger') ||
      changed.has('text');

    if (reInit) {
      /* Limpieza del ciclo anterior */
      this.removeEventListener('mouseenter', this._boundMouseEnter);
      clearTimeout(this._alwaysTimer);
      this._running = false;
      this._setupDecode();
    }
  }

  override render(): TemplateResult {
    return textGlitchTemplate({ text: this.text, variant: this.variant });
  }

  /* ── API pública ────────────────────────────────────────── */

  /**
   * Reproduce el efecto manualmente una vez.
   * - Para `decode`: lanza el scramble de kanji.
   * - Para `scan` / `redact`: activa [active] y lo retira al terminar.
   * - Para `slice` / `shift` / `noise`: activa [active] (CSS bucle).
   */
  play(): void {
    if (this.variant === 'decode') {
      this._decodePlay();
      return;
    }
    this.active = true;
    if (this.variant === 'scan' || this.variant === 'redact') {
      const dur = this.variant === 'scan' ? 620 : 720;
      setTimeout(() => { this.active = false; }, dur);
    }
  }

  /** Detiene el bucle `trigger="always"` y desactiva [active]. */
  stop(): void {
    clearTimeout(this._alwaysTimer);
    this._running = false;
    this.active = false;
  }

  /* ── Decode engine ──────────────────────────────────────── */

  private _setupDecode(): void {
    if (this.variant !== 'decode') return;

    if (this.trigger === 'hover') {
      this.addEventListener('mouseenter', this._boundMouseEnter);
    } else {
      /* always: esperamos el primer render completo para tener los .char */
      this.updateComplete.then(() => { this._scheduleAlwaysDecode(); });
    }
  }

  private _scheduleAlwaysDecode(): void {
    this._decodePlay();
    /* Pausa entre repeticiones: proporcional a la longitud del texto */
    const pause = Math.max([...this.text].length * 55 * 1.5, 400) + 2000;
    this._alwaysTimer = setTimeout(() => { this._scheduleAlwaysDecode(); }, pause);
  }

  /**
   * Motor de decodificación kanji.
   *
   * Cada char span se sustituye por un katakana/kanji aleatorio
   * durante un número variable de frames, y luego se resuelve al
   * carácter original. El orden de resolución es estocástico.
   */
  private _decodePlay(): void {
    if (this._running) return;
    this._running = true;

    const chars = Array.from(
      this.renderRoot.querySelectorAll<HTMLElement>('.char')
    );

    if (chars.length === 0) {
      this._running = false;
      return;
    }

    const SCRAMBLE_CYCLES = 6;
    const FRAME_MS        = 55;

    /* Delay estocástico por carácter — no resuelven de izquierda a derecha */
    const delays = chars.map(() =>
      Math.floor(Math.random() * chars.length * SCRAMBLE_CYCLES * 0.6) + SCRAMBLE_CYCLES
    );

    let frame = 0;
    const total = Math.max(...delays) + 2;

    const tick = (): void => {
      chars.forEach((span, i) => {
        const orig = span.dataset['original'] ?? '';

        if (frame < (delays[i] ?? 0)) {
          /* Espacios y puntuación — no se scramblea */
          if (orig.trim() === '' || orig === '·' || orig === '-') return;
          span.textContent = KANA[Math.floor(Math.random() * KANA.length)] ?? orig;
          span.classList.add('is-scrambling');
        } else {
          span.textContent = orig;
          span.classList.remove('is-scrambling');
        }
      });

      frame++;

      if (frame < total) {
        setTimeout(tick, FRAME_MS);
      } else {
        /* Garantía final — todos al original */
        chars.forEach(span => {
          span.textContent = span.dataset['original'] ?? '';
          span.classList.remove('is-scrambling');
        });
        this._running = false;
      }
    };

    tick();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-text-glitch': LibTextGlitch;
  }
}