import { html, type TemplateResult } from 'lit';

interface MarkerProps {
  label: string;
}

export const htmlTemplate = ({ label }: MarkerProps): TemplateResult => html`
  <div class="marker" role="status" aria-label="${label}">
    <span class="line"></span>
    <span class="text">
      <slot>${label}</slot>
    </span>
  </div>
`;