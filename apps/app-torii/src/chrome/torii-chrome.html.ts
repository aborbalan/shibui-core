import { html, nothing, type TemplateResult } from 'lit';
import { KATACHI_IDS, KATACHI_KANJI, KATACHI_LABEL } from '../data/katachi';
import type { ToriiChrome } from './torii-chrome.component';

const NAV_LINKS = [
  { id: 'home', label: 'Ecosistema', href: '#!/' },
  { id: 'salud', label: 'Salud', href: '#!/salud' },
  { id: 'deploys', label: 'Deploys', href: '#!/deploys' },
];

const FOOTER_COLUMNS = [
  {
    heading: 'Librería',
    links: [
      { label: 'Storybook', href: 'https://shibui-showcase-storybook.web.app' },
      { label: 'Docs de la API', href: 'https://shibui-api.web.app' },
    ],
  },
  {
    heading: 'Showcases',
    links: [
      { label: 'React', href: 'https://shibui-showcase-react.web.app' },
      { label: 'Angular', href: 'https://shibui-showcase-angular.web.app' },
      { label: 'Svelte', href: 'https://shibui-showcase-svelte.web.app' },
    ],
  },
  {
    heading: 'Satélites',
    links: [
      { label: 'hanko 判子', href: 'https://hanko-report.web.app' },
      { label: 'sukashi 透かし', href: 'https://sukashi.web.app' },
      { label: 'CV', href: 'https://shibui-cv.web.app' },
    ],
  },
];

export function toriiChromeTemplate(host: ToriiChrome): TemplateResult {
  return html`
    <lib-header
      theme="minimal"
      logo-mark="鳥"
      brand-name="torii"
      brand-tagline="la puerta al ecosistema shibui"
      logo-href="#!/"
      .links=${NAV_LINKS.map((link) => ({ ...link, active: link.id === host.activeRoute }))}
    ></lib-header>

    <slot></slot>

    <lib-footer
      compact
      brand-name="torii"
      brand-kanji="鳥居"
      brand-sub="Hub del ecosistema · Zaragoza"
      github-href="https://github.com/aborbalan/shibui-core"
      .columns=${FOOTER_COLUMNS}
      .navLinks=${NAV_LINKS.map(({ label, href }) => ({ label, href }))}
    ></lib-footer>

    <div class="switcher">
      ${host.panelOpen ? katachiPanel(host) : nothing}
      <button
        class="switcher__toggle"
        type="button"
        aria-expanded=${host.panelOpen}
        aria-controls="katachi-panel"
        @click=${() => host.togglePanel()}
      >
        <span class="switcher__kanji">${KATACHI_KANJI[host.katachi]}</span>
        <span>katachi</span>
      </button>
    </div>
  `;
}

function katachiPanel(host: ToriiChrome): TemplateResult {
  return html`
    <div class="switcher__panel" id="katachi-panel" role="group" aria-label="Elegir katachi">
      ${KATACHI_IDS.map(
        (id) => html`
          <button
            class="switcher__option"
            type="button"
            aria-current=${id === host.katachi}
            @click=${() => host.selectKatachi(id)}
          >
            <span class="switcher__kanji">${KATACHI_KANJI[id]}</span>
            <span>${KATACHI_LABEL[id]}</span>
          </button>
        `,
      )}
    </div>
  `;
}
