import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './lib-liquid-button.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

@customElement('lib-liquid-button')
export class LibLiquidButton extends LitElement {

  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(styles)}`,
  ];

  @property({ type: String }) label: string = 'Iniciar';

  protected override render(): TemplateResult {
    return html`
      <svg style="position: absolute; width: 0; height: 0;" aria-hidden="true">
        <defs>
          <filter id="shibui-liquid-filter">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.015 0.08" 
              numOctaves="2" 
              result="noise" 
            />
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale="25" 
            />
          </filter>
        </defs>
      </svg>

      <button class="liquid-button" role="button">
        <span class="label">${this.label}</span>
      </button>
    `;
  }
}