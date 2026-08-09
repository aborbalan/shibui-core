import { html, type TemplateResult } from 'lit';
import type { ToriiDeploys } from './torii-deploys.component';

export function toriiDeploysTemplate(_host: ToriiDeploys): TemplateResult {
  return html`
    <lib-eyebrow>配備 · deploys</lib-eyebrow>
    <lib-display-heading tag="h1" size="md" line1="Qué" accent="responde"></lib-display-heading>
  `;
}
