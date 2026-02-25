import { LitElement, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { skeletonTemplate } from './lib-skeleton.html';
import cssStyles from './lib-skeleton.css?inline';

export type SkeletonVariant = 'circle' | 'rect' | 'text';

@customElement('lib-skeleton')
export class LibSkeleton extends LitElement {
  static override styles = unsafeCSS(cssStyles);

  @property({ type: String, reflect: true }) variant: SkeletonVariant = 'rect';
  @property({ type: String }) width = '100%';
  @property({ type: String }) height = '100%';
  @property({ type: Boolean, reflect: true }) animated = true;

  protected override render(): TemplateResult {
    // Si es variante texto y no tiene altura definida, le damos una por defecto
    const finalHeight = this.variant === 'text' && this.height === '100%' ? '1em' : this.height;
    
    return skeletonTemplate(this.width, finalHeight);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-skeleton': LibSkeleton;
  }
}