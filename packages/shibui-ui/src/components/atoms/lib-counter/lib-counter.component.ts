import { LitElement, css, unsafeCSS, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { counterTemplate } from './lib-counter.html';
import type { LibCounterSize, LibCounterTone, LibCounterDeltaDir } from './lib-counter.html';
import counterCss from './lib-counter.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

export type { LibCounterSize, LibCounterTone, LibCounterDeltaDir };

/**
 * @element lib-counter
 *
 * Contador animado con digit-flip: cada dígito es una columna
 * de 0 a 9 que se desplaza con translateY. Los dígitos de mayor
 * peso animan antes que los de menor — efecto odómetro.
 *
 * @example — básico
 * <lib-counter value="24819" label="Usuarios activos" play-on-visible></lib-counter>
 *
 * @example — moneda con delta
 * <lib-counter value="18540" prefix="€" size="lg" tone="kaki"
 *   label="Ingresos" delta="+14,7%" delta-dir="up" play-on-visible>
 * </lib-counter>
 *
 * @example — porcentaje sin separador de miles
 * <lib-counter value="87" suffix="%" thousands="" size="md" play-on-visible></lib-counter>
 *
 * @example — con decimales
 * <lib-counter value="4" decimals="73" play-on-visible></lib-counter>
 * → renderiza  4,73
 */
@customElement('lib-counter')
export class LibCounter extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(counterCss)}`,
  ];

  /* ── Props visuales ─────────────────────────────────────── */

  /** Valor numérico a mostrar. */
  @property({ type: Number, reflect: true })
  value = 0;

  /** Carácter prefijo (€, $, …). */
  @property({ type: String, attribute: 'prefix', reflect: true })
  override prefix = '';

  /** Carácter sufijo (%, k, …). */
  @property({ type: String, attribute: 'suffix', reflect: true })
  suffix = '';

  /** Separador de miles. Default: punto. Vacío = sin separador. */
  @property({ type: String, attribute: 'thousands', reflect: true })
  thousands = '.';

  /**
   * Dígitos decimales a mostrar después de coma.
   * Ejemplo: decimals="73" → ",73"
   */
  @property({ type: Number, attribute: 'decimals', reflect: true })
  decimals: number | null = null;

  /** Tamaño del contador. */
  @property({ type: String, reflect: true })
  size: LibCounterSize = 'md';

  /** Tono de color. */
  @property({ type: String, reflect: true })
  tone: LibCounterTone = 'default';

  /** Etiqueta inferior en font-mono uppercase. */
  @property({ type: String })
  label = '';

  /** Texto del indicador de variación (e.g. "+14,7%"). */
  @property({ type: String })
  delta = '';

  /** Dirección del delta — controla color e icono. */
  @property({ type: String, attribute: 'delta-dir', reflect: true })
  deltaDir: LibCounterDeltaDir = 'up';

  /**
   * Si está presente, el contador arranca desde 0 y anima
   * hasta `value` cuando entra en el viewport (IntersectionObserver).
   * Nombre: play-on-visible (evita colisión con HTMLElement.animate).
   */
  @property({ type: Boolean, attribute: 'play-on-visible', reflect: true })
  playOnVisible = false;

  /* ── Internos ───────────────────────────────────────────── */

  // FIX: declare evita el error de overload en decoradores strict
  @query('.cnt-row')
  declare private _rowEl: HTMLElement;

  private _builtDigitCount = -1;
  private _builtThousands  = '';

  private _observer: IntersectionObserver | undefined;
  private _hasAnimated = false;
  private _firstUpdate = true;

  /* ── Lifecycle ──────────────────────────────────────────── */
  override connectedCallback(): void {
    super.connectedCallback();
    if (this.playOnVisible) {
      this._observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && !this._hasAnimated) {
            this._hasAnimated = true;
            this._animateTo(this.value, /* fromZero */ true);
            this._observer?.disconnect();
          }
        },
        { threshold: 0.2 }
      );
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._observer?.disconnect();
  }

  override render(): TemplateResult {
    return counterTemplate({
      size:     this.size,
      tone:     this.tone,
      label:    this.label,
      delta:    this.delta,
      deltaDir: this.deltaDir,
    });
  }

  override updated(changed: PropertyValues): void {
    super.updated(changed);

    const structureChanged =
      changed.has('value')     ||
      changed.has('prefix')    ||
      changed.has('suffix')    ||
      changed.has('thousands') ||
      changed.has('decimals');

    if (!structureChanged && !this._firstUpdate) return;

    const needRebuild = this._needsRebuild();
    if (needRebuild) {
      this._buildRow();
    }

    if (this._firstUpdate) {
      this._firstUpdate = false;

      if (this.playOnVisible) {
        // Construir en 0 y esperar viewport
        this._setRowInstant(0);
        // FIX: cast a Element para satisfacer IntersectionObserver.observe()
        this._observer?.observe(this as unknown as Element);
      } else {
        this._setRowInstant(this.value);
      }
      return;
    }

    if (changed.has('value')) {
      this._animateTo(this.value, /* fromZero */ false);
    }
  }

  /* ── Motor de digit-flip ────────────────────────────────── */

  private _needsRebuild(): boolean {
    const digitCount = Math.abs(Math.floor(this.value)).toString().length;
    if (digitCount !== this._builtDigitCount) return true;
    if (this.thousands !== this._builtThousands) return true;
    return false;
  }

  private _buildRow(): void {
    const row = this._rowEl;
    if (!row) return;
    row.innerHTML = '';

    const absVal = Math.abs(Math.floor(this.value));
    const str    = absVal.toString();
    this._builtDigitCount = str.length;
    this._builtThousands  = this.thousands;

    if (this.prefix) {
      const p = document.createElement('span');
      p.className   = 'cnt-prefix';
      p.textContent = this.prefix;
      row.appendChild(p);
    }

    const chars = this._buildCharArray(str, this.thousands);
    chars.forEach((c) => {
      if (c.type === 'sep') {
        const sep = document.createElement('span');
        sep.className   = 'cnt-sep';
        sep.textContent = c.char;
        row.appendChild(sep);
      } else {
        row.appendChild(this._makeDigitSlot(parseInt(c.char, 10)));
      }
    });

    if (this.decimals !== null) {
      const dot = document.createElement('span');
      dot.className   = 'cnt-sep';
      dot.textContent = ',';
      row.appendChild(dot);

      const decStr = this.decimals.toString().padStart(2, '0');
      for (const ch of decStr) {
        row.appendChild(this._makeDigitSlot(parseInt(ch, 10)));
      }
    }

    if (this.suffix) {
      const s = document.createElement('span');
      s.className   = 'cnt-suffix';
      s.textContent = this.suffix;
      row.appendChild(s);
    }
  }

  private _buildCharArray(
    str: string,
    thousands: string
  ): Array<{ type: 'digit' | 'sep'; char: string }> {
    const result: Array<{ type: 'digit' | 'sep'; char: string }> = [];
    for (let i = 0; i < str.length; i++) {
      const posFromRight = str.length - 1 - i;
      if (i > 0 && posFromRight % 3 === 2 && thousands) {
        result.push({ type: 'sep', char: thousands });
      }
      // FIX: str[i] es string | undefined en TS estricto — asegurar con ?? '0'
      result.push({ type: 'digit', char: str[i] ?? '0' });
    }
    return result;
  }

  private _makeDigitSlot(digit: number): HTMLElement {
    const slot = document.createElement('span');
    slot.className = 'cnt-digit';

    const inner = document.createElement('span');
    inner.className = 'cnt-digit-inner';

    for (let i = 0; i <= 9; i++) {
      const span = document.createElement('span');
      span.textContent = String(i);
      inner.appendChild(span);
    }

    inner.style.transition = 'none';
    inner.style.transform  = `translateY(-${digit}em)`;
    slot.appendChild(inner);
    return slot;
  }

  private _setRowInstant(value: number): void {
    const slots = this._rowEl?.querySelectorAll<HTMLElement>('.cnt-digit');
    if (!slots) return;
    const digits = this._extractTargetDigits(value);
    slots.forEach((slot, i) => {
      const inner = slot.querySelector<HTMLElement>('.cnt-digit-inner');
      if (!inner) return;
      inner.style.transition = 'none';
      inner.style.transform  = `translateY(-${digits[i] ?? 0}em)`;
    });
  }

  private _animateTo(value: number, fromZero: boolean): void {
    const slots = this._rowEl?.querySelectorAll<HTMLElement>('.cnt-digit');
    if (!slots || !slots.length) return;

    const targetDigits = this._extractTargetDigits(value);
    const total        = slots.length;

    slots.forEach((slot, i) => {
      const inner = slot.querySelector<HTMLElement>('.cnt-digit-inner');
      if (!inner) return;

      const target    = targetDigits[i] ?? 0;
      const fromRight = total - 1 - i;
      const delay     = fromRight * 40;

      if (fromZero) {
        inner.style.transition = 'none';
        inner.style.transform  = 'translateY(0)';
      }

      void inner.offsetHeight; // forzar reflow

      inner.style.transition = `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;
      inner.style.transform  = `translateY(-${target}em)`;
    });
  }

  private _extractTargetDigits(value: number): number[] {
    const absVal = Math.abs(Math.floor(value));
    let   str    = absVal.toString();

    if (this.decimals !== null) {
      const decStr = this.decimals.toString().padStart(2, '0');
      str = str + decStr;
    }

    return str.split('').map((c) => parseInt(c, 10));
  }

  /* ── Public API ─────────────────────────────────────────── */

  /** Anima el contador a un nuevo valor manualmente. */
  public animateTo(value: number): void {
    this.value = value;
  }

  /** Reinicia la animación desde cero al valor actual. */
  public replay(): void {
    this._hasAnimated = false;
    this._animateTo(this.value, true);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-counter': LibCounter;
  }
}