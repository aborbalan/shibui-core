import { html, type TemplateResult } from 'lit';
import { ECOSYSTEM, type EcosystemEntry } from '../../data/ecosystem';
import { VERDICT_DOT, VERDICT_LABEL, type ProbeResult } from '../../data/loaders/deploys.loader';
import type { ToriiDeploys } from './torii-deploys.component';

export function toriiDeploysTemplate(host: ToriiDeploys): TemplateResult {
  return html`
    <div class="wrap">
      <lib-eyebrow>配備 · deploys</lib-eyebrow>
      <lib-display-heading tag="h1" size="md" line1="Qué" accent="está en pie"></lib-display-heading>

      <p class="lede">
        Ocho sitios, un proyecto de Firebase y una API en Render. Esta página los llama
        uno a uno desde tu navegador y cuenta lo que contestan.
      </p>

      <p class="caveat">
        Con honestidad sobre qué se mide: Firebase Hosting no manda cabeceras CORS, así que
        de sus sitios <strong>no se puede leer el status</strong> — solo si el host contesta.
        Donde pone <em>alcanzable</em> es eso literalmente, y no un 200. Solo hanko y la API
        permiten leer el status de verdad.
      </p>

      ${host.results === null ? loading() : grid(host.results)}

      <dl class="legend">
        <div>
          <dt>responde</dt>
          <dd>— status leído y correcto. Solo donde hay CORS.</dd>
        </div>
        <div>
          <dt>alcanzable</dt>
          <dd>— el host contestó algo. No sabemos con qué status.</dd>
        </div>
        <div>
          <dt>no responde</dt>
          <dd>— nada dentro del plazo. La API duerme en Render y su primer golpe puede agotarlo.</dd>
        </div>
      </dl>
    </div>
  `;
}

function loading(): TemplateResult {
  return html`
    <div class="grid">
      ${ECOSYSTEM.map(() => html`<lib-skeleton height="7.5rem"></lib-skeleton>`)}
    </div>
  `;
}

function grid(results: ProbeResult[]): TemplateResult {
  const byId = new Map(results.map((r) => [r.id, r]));

  return html`
    <div class="grid">
      ${ECOSYSTEM.map((entry) => card(entry, byId.get(entry.id)))}
    </div>
  `;
}

function card(entry: EcosystemEntry, result: ProbeResult | undefined): TemplateResult {
  const verdict = result?.verdict ?? 'unreachable';

  return html`
    <article class="site">
      <div class="site__head">
        <lib-status-dot status=${VERDICT_DOT[verdict]} size="md"></lib-status-dot>
        <h2 class="site__name">${entry.name}</h2>
      </div>
      <p class="site__verdict">${VERDICT_LABEL[verdict]}</p>
      ${entry.url
        ? html`<a
            class="site__url"
            href=${entry.url}
            target="_blank"
            rel="noopener noreferrer"
            >${entry.url.replace(/^https:\/\//, '')}</a
          >`
        : html`<span class="site__url">se descarga, no se visita</span>`}
      <div class="site__meta">
        <span>${modeLabel(entry.probe)}</span>
        <span>${detail(result)}</span>
      </div>
    </article>
  `;
}

function modeLabel(mode: EcosystemEntry['probe']): string {
  if (mode === 'cors') return 'lectura real';
  if (mode === 'opaque') return 'respuesta opaca';
  return 'sin sonda';
}

/** Solo se enseña el status cuando de verdad se ha podido leer. */
function detail(result: ProbeResult | undefined): string {
  if (!result || result.verdict === 'not-applicable') return '—';
  const status = result.status === null ? '' : `${result.status} · `;
  return result.ms === null ? status || '—' : `${status}${result.ms} ms`;
}
