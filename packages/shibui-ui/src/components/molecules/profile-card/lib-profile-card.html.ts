import { html, TemplateResult } from 'lit';
import { LibProfileCard } from './lib-profile-card.component';

export const profileCardTemplate = (context: LibProfileCard): TemplateResult => html`
  <lib-card>
    <div class="profile-card-body">
      ${context.loading 
        ? html`
            <lib-skeleton variant="circle" width="64px" height="64px"></lib-skeleton>
            <div class="info-skeleton">
              <lib-skeleton variant="text" width="120px" height="1.2em"></lib-skeleton>
              <lib-skeleton variant="text" width="80px" height="0.8em"></lib-skeleton>
            </div>
          `
        : html`
            <lib-avatar .src=${context.avatarSrc} .name=${context.name} size="lg">
              <lib-status-dot slot="status" .variant=${context.statusVariant} ?pulse=${context.pulse}></lib-status-dot>
            </lib-avatar>
            <div class="info">
              <h3 class="name">${context.name}</h3>
              <p class="role">${context.role}</p>
            </div>
          `
      }
    </div>
  </lib-card>
`;