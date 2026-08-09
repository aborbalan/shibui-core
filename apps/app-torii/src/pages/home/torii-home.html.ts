import { html, type TemplateResult } from 'lit';
import { ECOSYSTEM, type EcosystemEntry } from '../../data/ecosystem';
import { KATACHI_BG } from '../../data/katachi';
import type { ToriiHome } from './torii-home.component';

export function toriiHomeTemplate(host: ToriiHome): TemplateResult {
  return html`
    <lib-background theme=${KATACHI_BG[host.katachi]}></lib-background>

    <div class="wrap">
      <lib-eyebrow>鳥居 · la puerta</lib-eyebrow>
      <lib-display-heading
        tag="h1"
        size="lg"
        line1="Un sistema"
        accent="y todo lo que corre sobre él"
      ></lib-display-heading>

      <p class="lede">
        Una sola fuente de verdad —web components sobre Lit— consumida por apps en cinco
        entornos distintos, verificada por su propio sello y desplegada en ocho sitios.
        Esto es la puerta a todos ellos.
      </p>

      <div class="kpis">${kpis(host)}</div>

      <p class="section-label">
        <span>01</span><span>Las piezas</span>
      </p>

      <lib-bento-grid columns="4" gap="md" row-height="180px">
        ${ECOSYSTEM.map((entry) => cell(entry))}
      </lib-bento-grid>
    </div>
  `;
}

function kpis(host: ToriiHome): TemplateResult {
  return html`
    <lib-counter
      .value=${host.componentCount}
      label="Componentes"
      size="lg"
      play-on-visible
    ></lib-counter>
    <lib-counter
      .value=${host.trustedCount}
      label="Con sello de confianza"
      size="lg"
      tone="accent"
      play-on-visible
    ></lib-counter>
    <lib-counter
      .value=${host.frameworkCount}
      label="Entornos que la consumen"
      size="lg"
      play-on-visible
    ></lib-counter>
    <lib-counter value="0" label="Dependencias de framework" size="lg" play-on-visible></lib-counter>
  `;
}

function cell(entry: EcosystemEntry): TemplateResult {
  const inner = html`
    <div class="cell__head">
      <h3 class="cell__name">${entry.name}</h3>
      <span class="cell__kanji" aria-hidden="true">${entry.kanji}</span>
    </div>
    <p class="cell__lede">${entry.lede}</p>
    <div class="cell__foot">
      <span>${entry.stack}</span>
      ${entry.url
        ? html`<span class="cell__go" aria-hidden="true">↗</span>`
        : html`<span>sin sitio web</span>`}
    </div>
  `;

  return html`
    <lib-bento-item cols=${entry.cols} rows="1" ?interactive=${Boolean(entry.url)}>
      ${entry.url
        ? html`<a
            class="cell"
            href=${entry.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label=${`${entry.name} — abrir en una pestaña nueva`}
            >${inner}</a
          >`
        : html`<div class="cell">${inner}</div>`}
    </lib-bento-item>
  `;
}
