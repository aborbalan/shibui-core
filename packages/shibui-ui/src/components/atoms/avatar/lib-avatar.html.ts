import { html, TemplateResult } from 'lit';
import { LibAvatar } from './lib-avatar.component';

export const avatarTemplate = (
  context: LibAvatar, 
  showImage: boolean, 
  initials: string,
  onError: () => void
): TemplateResult => html`
  <div class="avatar-container" role="img" aria-label="${context.name}">
    ${showImage 
      ? html`<img src="${context.src}" alt="${context.name}" @error=${onError} />`
      : html`<div class="initials">${initials}</div>`
    }
    <div class="status-slot">
      <slot name="status"></slot>
    </div>
  </div>
`;