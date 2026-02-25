import { LitElement, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { avatarTemplate } from './lib-avatar.html';
import cssStyles from './lib-avatar.css?inline';

@customElement('lib-avatar')
export class LibAvatar extends LitElement {
  static override styles = unsafeCSS(cssStyles);

  @property({ type: String }) src = '';
  @property({ type: String }) name = '';
  @property({ type: String, reflect: true }) size: 'sm' | 'md' | 'lg' = 'md';
  @property({ type: Boolean, reflect: true }) rounded = false;

  @state() private hasError = false;

  private _getInitials(name: string): string {
    if (!name) return '';
    const parts = name.split(' ');
    return parts.map(p => p[0]).join('').toUpperCase().substring(0, 2);
  }

  protected override render(): TemplateResult {
    const initials = this._getInitials(this.name);
    const showImage = !!this.src && !this.hasError;
    
    return avatarTemplate(this, showImage, initials, () => this.hasError = true);
  }
}