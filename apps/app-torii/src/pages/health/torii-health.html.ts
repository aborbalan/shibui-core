import { html, type TemplateResult } from 'lit';
import type { ToriiHealth } from './torii-health.component';

export function toriiHealthTemplate(_host: ToriiHealth): TemplateResult {
  return html`
    <lib-eyebrow>判子 · hanko</lib-eyebrow>
    <lib-display-heading tag="h1" size="md" line1="Salud" accent="del sistema"></lib-display-heading>
  `;
}
