import { html, type TemplateResult } from 'lit';
import type { ToriiHome } from './torii-home.component';

export function toriiHomeTemplate(_host: ToriiHome): TemplateResult {
  return html`
    <lib-eyebrow>鳥居 · la puerta</lib-eyebrow>
    <lib-display-heading
      tag="h1"
      size="lg"
      line1="Un sistema"
      accent="y todo lo que corre sobre él"
    ></lib-display-heading>
  `;
}
