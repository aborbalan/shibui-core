import { html, type TemplateResult } from 'lit';
import { KATACHI_BG } from '../../data/katachi';
import type { ToriiArquitectura } from './torii-arquitectura.component';

/** El fuente del diagrama, en el repo. `develop` es el trunk de integración. */
const PUML_HREF =
  'https://github.com/aborbalan/shibui-core/blob/develop/apps/app-torii/docs/arquitectura/ecosistema.puml';

/** Ruta del asset generado, servido tal cual desde `public/`. */
const SVG_HREF = 'arquitectura/ecosistema.svg';

export function toriiArquitecturaTemplate(host: ToriiArquitectura): TemplateResult {
  return html`
    <lib-background theme=${KATACHI_BG[host.katachi]}></lib-background>

    <div class="wrap">
      <lib-eyebrow>鳥居 · el plano</lib-eyebrow>
      <lib-display-heading
        tag="h1"
        size="lg"
        line1="La estructura"
        accent="de todo el ecosistema"
      ></lib-display-heading>

      <p class="lede">
        Trece piezas en un solo monorepo: una librería de web components, las apps que la
        consumen desde cinco entornos distintos, las herramientas que la verifican y los
        servicios que la publican. Esto es el mapa de quién depende de quién.
      </p>

      <p class="section-label"><span>01</span><span>El plano</span></p>

      <figure class="plate">
        <div class="plate__frame">
          <img
            class="plate__img"
            src=${SVG_HREF}
            width="963"
            height="499"
            alt="Diagrama de componentes del ecosistema shibui: las apps de apps/, los paquetes de packages/ y los servicios, con las dependencias entre ellos. La descripción en texto está justo debajo."
          />
        </div>
        <figcaption class="plate__caption">
          <span>Diagrama de componentes UML · PlantUML</span>
          <a href=${SVG_HREF} target="_blank" rel="noopener noreferrer">Abrir a tamaño completo ↗</a>
        </figcaption>
      </figure>

      <p class="section-label"><span>02</span><span>Cómo se lee</span></p>

      <dl class="legend">
        ${legendItem(
          'solid',
          'Línea continua',
          'Dependencia de código: el paquete entra en el build del otro. Casi siempre un ' +
            '@shibui-ui/ui declarado como workspace:* en el package.json.',
        )}
        ${legendItem(
          'dashed',
          'Línea discontinua',
          'Consumo en tiempo de ejecución: un fetch a un sitio ya desplegado. No hay ' +
            'dependencia de código, así que no rompe un build — rompe una pantalla.',
        )}
      </dl>

      <details class="longdesc">
        <summary>La misma estructura, en texto</summary>
        <ul>
          <li>
            <strong>shibui/ui</strong> es la base: 102 web components sobre Lit 3. De ella
            dependen las seis apps —los tres showcases espejo, el CV, la app de escritorio y
            este mismo hub, que la usa nativa, sin wrapper.
          </li>
          <li>
            <strong>consumer-tests</strong> verifica que el contrato de la librería se cumple
            igual en React, Angular y Svelte; <strong>hanko</strong> la audita y publica el
            Trust Report que torii lee en la página de Salud.
          </li>
          <li>
            <strong>shibui-api</strong> cataloga el manifiesto de la librería y lo sirve como
            API; el <strong>cf-cache-worker</strong> la cachea en el borde y torii pide su
            <code>/components</code>.
          </li>
          <li>
            <strong>kura</strong> despliega los sitios a Firebase Hosting.
            <strong>sukashi</strong> no depende de la librería: es independiente y tiene su
            propio sitio.
          </li>
        </ul>
      </details>

      <p class="colofon">
        El diagrama no se dibuja a mano: se escribe en PlantUML y se renderiza en local con
        <code>tools/uml</code>, sin Java ni servidor externo.
        <a href=${PUML_HREF} target="_blank" rel="noopener noreferrer">Ver el fuente .puml ↗</a>
      </p>
    </div>
  `;
}

function legendItem(kind: 'solid' | 'dashed', term: string, description: string): TemplateResult {
  return html`
    <div class="legend__item">
      <dt>
        <svg class="legend__line" viewBox="0 0 48 8" aria-hidden="true" focusable="false">
          <line
            x1="2"
            y1="4"
            x2="46"
            y2="4"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-dasharray=${kind === 'dashed' ? '5 4' : '0'}
          />
        </svg>
        <span>${term}</span>
      </dt>
      <dd>${description}</dd>
    </div>
  `;
}
