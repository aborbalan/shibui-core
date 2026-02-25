import { LitElement, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { profileCardTemplate } from './lib-profile-card.html';
import cssStyles from './lib-profile-card.css?inline';

// Importamos los componentes que consumimos internamente
import '../../atoms/card/lib-card.component';
import '../../atoms/avatar/lib-avatar.component';
import '../../atoms/status-dot/lib-status-dot.component';
import '../../atoms/skeleton/lib-skeleton.component';

@customElement('lib-profile-card')
export class LibProfileCard extends LitElement {
  static override styles = unsafeCSS(cssStyles);

  @property({ type: String }) name = '';
  @property({ type: String }) override role = '';
  @property({ type: String }) avatarSrc = '';
  @property({ type: String }) statusVariant: 'success' | 'danger' | 'warning' | 'neutral' = 'neutral';
  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean }) pulse = false;

  protected override render(): TemplateResult {
    return profileCardTemplate(this);
  }
}