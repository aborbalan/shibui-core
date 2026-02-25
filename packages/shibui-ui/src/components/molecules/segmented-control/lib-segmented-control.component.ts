import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property, state, queryAll } from 'lit/decorators.js';
import segmentedStyles from './lib-segmented-control.css?inline';

export interface SegmentedOption {
  label: string;
  value: string;
  icon?: string;
}

@customElement('lib-segmented-control')
export class LibSegmentedControl extends LitElement {
  static override styles = [css`${unsafeCSS(segmentedStyles)}` || []];

  @property({ type: Array }) options: SegmentedOption[] = [];
  @property({ type: String, reflect: true }) value = '';
  @property({ type: Boolean, reflect: true }) disabled = false;

  @state() private _thumbStyle = '';
  @queryAll('.segment') private _segments!: NodeListOf<HTMLElement>;

  override firstUpdated():void {
    this._updateThumb();
  }

  override updated(changedProperties: Map<string, unknown>):void {
    if (changedProperties.has('value')) {
      this._updateThumb();
    }
  }

  private _updateThumb():void {
    const index = this.options.findIndex(opt => opt.value === this.value);
    if (index !== -1 && this._segments[index]) {
      const segment = this._segments[index];
      this._thumbStyle = `
        width: ${segment.offsetWidth}px;
        transform: translateX(${segment.offsetLeft}px);
      `;
    }
  }

  private _handleSelect(option: SegmentedOption):void {
    if (this.disabled) return;
    this.value = option.value;
    
    this.dispatchEvent(new CustomEvent('ui-lib-change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  override render(): TemplateResult {
    return html`
      <div class="segmented-control" role="radiogroup">
        <div class="thumb" style="${this._thumbStyle}"></div>
        
        ${this.options.map(option => html`
          <button
            class="segment ${this.value === option.value ? 'is-active' : ''}"
            role="radio"
            aria-checked="${this.value === option.value}"
            ?disabled=${this.disabled}
            @click=${():void => this._handleSelect(option)}
          >
            ${option.icon ? html`<lib-icon name="${option.icon}" size="sm"></lib-icon>` : ''}
            <span>${option.label}</span>
          </button>
        `)}
      </div>
    `;
  }
}