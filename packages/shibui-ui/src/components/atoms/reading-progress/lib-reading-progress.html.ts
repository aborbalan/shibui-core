import { html, TemplateResult } from 'lit';
import { LibReadingProgress } from './lib-reading-progress.component';

export const readingProgressTemplate = (context: LibReadingProgress): TemplateResult => html`
  <div class="progress-container" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${context.progress}">
    <div class="progress-bar" style="width: ${context.progress}%"></div>
  </div>
`;