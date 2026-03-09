import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, state, queryAll } from 'lit/decorators.js';
import segmentedCss from './lib-segmented-control.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import { segmentedTemplate } from './lib-segmented-control.html';
import type {
  SegmentedOption,
  SegmentedVariant,
  SegmentedSize,
  SegmentedChangeDetail,
} from './lib-segmented-control.types';

/**
 * @element lib-segmented-control
 *
 * Control de selección exclusiva entre N opciones.
 * El thumb se desplaza con `transform: translateX` calculado sobre
 * el `offsetLeft` / `offsetWidth` del option activo.
 *
 * @prop {SegmentedOption[]} options  — Array de opciones
 * @prop {string}            value    — Valor activo (reflected)
 * @prop {SegmentedVariant}  variant  — Superficie visual (reflected)
 * @prop {SegmentedSize}     size     — Tamaño (reflected)
 * @prop {boolean}           full     — Ocupa el 100% del ancho (reflected)
 * @prop {boolean}           icon-only — Solo iconos, sin texto (reflected)
 * @prop {boolean}           disabled — Deshabilitado (reflected)
 * @prop {boolean}           glitch   — Efecto de corrupción al cambiar (reflected)
 *
 * @fires ui-lib-change — Al cambiar la selección
 *   Detail: { value: string, previousValue: string }
 *
 * @slot — No usa slots; las opciones se pasan vía `.options`
 */
@customElement('lib-segmented-control')
export class LibSegmentedControl extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(segmentedCss)}`,
  ];

  /* ── Props públicas ── */

  @property({ type: Array })
  options: SegmentedOption[] = [];

  @property({ type: String, reflect: true })
  value = '';

  @property({ type: String, reflect: true })
  variant: SegmentedVariant = 'outline';

  @property({ type: String, reflect: true })
  size: SegmentedSize = 'md';

  @property({ type: Boolean, reflect: true })
  full = false;

  @property({ type: Boolean, reflect: true, attribute: 'icon-only' })
  iconOnly = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  glitch = false;

  /* ── Estado interno ── */

  @state() private _thumbStyle = '';

  /** Referencia a los nodos .seg-option en el Shadow DOM */
  @queryAll('.seg-option')
  private declare _optionEls: NodeListOf<HTMLElement>;

  /* ── Ciclo de vida ── */

  protected override firstUpdated(): void {
    this._updateThumb();
  }

  protected override updated(changed: Map<PropertyKey, unknown>): void {
    if (changed.has('value') || changed.has('variant') || changed.has('options')) {
      // next microtask — el DOM ya refleja el nuevo estado
      Promise.resolve().then((): void => this._updateThumb());
    }
  }

  /* ── Thumb engine ── */

  private _updateThumb(): void {
    const idx = this.options.findIndex(o => o.value === this.value);
    if (idx === -1) return;

    // Acceso seguro con ! — el índice está dentro de los límites de options
    const el = this._optionEls[idx];
    if (!el) return;

    const isUnderline =
      this.variant === 'underline' || this.variant === 'dark-underline';

    const w = el.offsetWidth;
    // Para underline el offset no necesita corrección de padding del track
    const x = isUnderline
      ? el.offsetLeft
      : el.offsetLeft - this._getTrackPadding();

    this._thumbStyle = `width:${w}px;transform:translateX(${x}px)`;
  }

  private _getTrackPadding(): number {
    const track = this.renderRoot.querySelector<HTMLElement>('.seg');
    if (!track) return 3;
    return parseInt(getComputedStyle(track).paddingLeft, 10) || 3;
  }

  /* ── Selección ── */

  private _handleSelect(option: SegmentedOption, evt: MouseEvent): void {
    if (this.disabled || option.disabled) return;
    const previousValue = this.value;
    if (option.value === previousValue) return;

    this.value = option.value;

    // Glitch flash
    if (this.glitch) {
      const idx  = this.options.findIndex(o => o.value === this.value);
      const node = this._optionEls[idx];
      if (node) {
        node.classList.add('glitch-on');
        setTimeout((): void => node.classList.remove('glitch-on'), 340);
      }
    }

    // Ripple
    this._triggerRipple(evt);

    this.dispatchEvent(
      new CustomEvent<SegmentedChangeDetail>('ui-lib-change', {
        detail: { value: this.value, previousValue },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _triggerRipple(evt: MouseEvent): void {
    const target = evt.currentTarget as HTMLElement | null;
    if (!target) return;

    let wrap = target.querySelector<HTMLElement>('.seg-ripple');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'seg-ripple';
      target.appendChild(wrap);
    }

    const dot = document.createElement('div');
    dot.className = 'seg-ripple-dot';
    dot.style.left      = '50%';
    dot.style.top       = '50%';
    dot.style.marginLeft = '-2px';
    dot.style.marginTop  = '-2px';
    wrap.appendChild(dot);
    setTimeout((): void => dot.remove(), 400);
  }

  /* ── API pública ── */

  /** Selecciona un valor programáticamente */
  public select(value: string): void {
    const opt = this.options.find(o => o.value === value);
    if (opt && !opt.disabled) {
      const prev = this.value;
      this.value = value;
      this.dispatchEvent(
        new CustomEvent<SegmentedChangeDetail>('ui-lib-change', {
          detail: { value, previousValue: prev },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  /* ── Render ── */

  protected override render(): TemplateResult {
    return segmentedTemplate({
      options:    this.options,
      value:      this.value,
      variant:    this.variant,
      size:       this.size,
      full:       this.full,
      iconOnly:   this.iconOnly,
      disabled:   this.disabled,
      glitch:     this.glitch,
      thumbStyle: this._thumbStyle,
      onSelect:   (opt, evt): void => this._handleSelect(opt, evt),
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-segmented-control': LibSegmentedControl;
  }
}