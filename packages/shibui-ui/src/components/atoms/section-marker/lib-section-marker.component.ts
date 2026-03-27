import { css, LitElement, unsafeCSS, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { htmlTemplate } from './lib-section-marker.html.js';
import styles from './lib-section-marker.css?inline';

@customElement('lib-section-marker')
export class LibSectionMarker extends LitElement {
    static override styles = [css`${unsafeCSS(styles)}`];

  /** El texto que se mostrará en el marcador */
  @property({ type: String }) 
  label: string | undefined = undefined;

  protected override render(): TemplateResult {
    return htmlTemplate({
      label: this.label ?? ''
    });
  }
}
