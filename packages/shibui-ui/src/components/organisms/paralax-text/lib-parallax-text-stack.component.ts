import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';
import styles from './lib-parallax-text-stack.css?inline';

@customElement('lib-parallax-text-stack')
export class LibParallaxTextStack extends LitElement {
  static override styles = css`${unsafeCSS(styles)}`;

  @property({ type: Array }) lines: string[] = [];
  @property({ type: Number }) speed: number = 0.2;

  // Castamos el queryAll a HTMLElement para poder acceder a .style sin errores de TS
  @queryAll('.parallax-layer') _layers!: NodeListOf<HTMLElement>;

  private _handleScroll = (): void => {
    const rect = this.getBoundingClientRect();
    const scrollMiddle = window.innerHeight / 2;
    const componentMiddle = rect.top + rect.height / 2;
    const distance = scrollMiddle - componentMiddle;

    // Usamos Array.from o simplemente el forEach de NodeListOf<HTMLElement>
    this._layers.forEach((layer, index) => {
      const factor = (index + 1) * this.speed;
      const movement = distance * factor;
      // Ahora TS ya sabe que 'layer' es un HTMLElement y tiene 'style'
      layer.style.transform = `translateX(${movement}px)`;
    });
  };

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('scroll', this._handleScroll);
    // Ejecutamos una vez al inicio para posicionar
    this._handleScroll();
  }

  override disconnectedCallback(): void {
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