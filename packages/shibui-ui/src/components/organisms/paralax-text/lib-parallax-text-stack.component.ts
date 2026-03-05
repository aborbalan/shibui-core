import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';
import styles from './lib-parallax-text-stack.css?inline';

@customElement('lib-parallax-text-stack')
export class LibParallaxTextStack extends LitElement {
  static override styles = css`${unsafeCSS(styles)}`;

  @property({ type: Array }) lines: string[] = [];
  @property({ type: Number }) speed: number = 0.2;

  @queryAll('.parallax-layer') _layers!: NodeListOf<HTMLElement>;

  private _handleScroll = () => {
    const rect = this.getBoundingClientRect();
    const scrollMiddle = window.innerHeight / 2;
    const componentMiddle = rect.top + rect.height / 2;
    const distance = scrollMiddle - componentMiddle;

    this._layers.forEach((layer, index) => {
      // Cada capa tiene una velocidad ligeramente diferente basada en su índice
      const factor = (index + 1) * this.speed;
      const movement = distance * factor;
      layer.style.transform = `translateX(${movement}px)`;
    });
  };

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener('scroll', this._handleScroll);
  }

  override disconnectedCallback() {
    window.removeEventListener('scroll', this._handleScroll);
    super.disconnectedCallback();
  }

  protected override render(): TemplateResult {
    return html`
      <div class="stack-container">
        ${this.lines.map((line, i) => html`
          <span class="parallax-layer ${i % 2 === 0 ? 'layer--outline' : 'layer--italic'}">
            ${line}
          </span>
        `)}
      </div>
    `;
  }
}