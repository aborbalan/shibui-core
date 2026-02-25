import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import groupStyles from './lib-avatar-group.css?inline';
import { LibAvatar } from '../../atoms/avatar/lib-avatar.component';

@customElement('lib-avatar-group')
export class LibAvatarGroup extends LitElement {
  static override styles = [css`${unsafeCSS(groupStyles)}` || []];

  @property({ type: Number }) max = 4;
  @property({ type: String, reflect: true }) size: 'sm' | 'md' | 'lg' = 'md';

  @queryAssignedElements({ slot: '', selector: 'lib-avatar' })
  _avatars!: Array<LibAvatar>;

  private _handleSlotChange():void {
    this._updateAvatars();
    this.requestUpdate();
  }

  private _updateAvatars():void {
    if (!this._avatars) return;
    this._avatars.forEach((avatar, index) => {
      avatar.size = this.size;
      avatar.rounded = true; 
      avatar.style.display = index < this.max ? 'inline-block' : 'none';
    });
  }

  override render(): TemplateResult {
    const total = this._avatars?.length || 0;
    const extraCount = Math.max(0, total - this.max);

    return html`
      <div class="avatar-group" role="group">
        <slot @slotchange=${this._handleSlotChange}></slot>
        ${extraCount > 0 ? html`<div class="counter">+${extraCount}</div>` : ''}
      </div>
    `;
  }
}