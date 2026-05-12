import { LitElement, TemplateResult, css, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { visuallyHiddenTemplate } from './lib-visually-hidden.html';
import styles from './lib-visually-hidden.css?inline';

@customElement('lib-visually-hidden')
export class LibVisuallyHidden extends LitElement {
  static override styles = [css`${unsafeCSS(styles)}`];

  protected override render(): TemplateResult {
    return visuallyHiddenTemplate();
  }
}