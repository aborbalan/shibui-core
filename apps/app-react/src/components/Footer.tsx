import React from 'react';
import { LibFooter } from '@shibui-ui/ui/react';
import { FooterColumn, FooterLink } from '@shibui-ui/ui';

type FooterTheme = 'social' | 'accordion' | 'inverse' | 'glitch' | 'celadon' | 'sabi' | 'shizen';

interface FooterProps {
  theme?: FooterTheme;
  /** Modo compacto: barra de una sola fila, para footers sticky/pinned */
  compact?: boolean;
  brandName?: string;
  brandKanji?: string;
  brandSub?: string;
  location?: string;
  version?: string;
  nodeVersion?: string;
  githubHref?: string;
  linkedinHref?: string;
  rssHref?: string;
  email?: string;
  columns?: FooterColumn[];
  navLinks?: FooterLink[];
  legalLinks?: FooterLink[];
  runtimeLines?: { key: string; value: string }[];
}

/**
 * Destinos reales del ecosistema. Estas columnas eran `href: '#'` de principio
 * a fin, asi que el footer prometia una red de sitios y no llevaba a ninguno.
 * Solo se enlaza lo que existe: sukashi no esta en npm, y no hay pagina de
 * roadmap, asi que esas entradas no estan en vez de apuntar a la nada.
 */
const ECOSYSTEM = {
  torii:     'https://shibui-torii.web.app',
  storybook: 'https://shibui-showcase-storybook.web.app',
  apiDocs:   'https://shibui-api.web.app',
  hanko:     'https://hanko-report.web.app',
  sukashi:   'https://sukashi.web.app',
  github:    'https://github.com/aborbalan/shibui-core',
  npm:       'https://www.npmjs.com/package/@shibui-ui/ui',
  releases:  'https://github.com/aborbalan/shibui-core/releases',
} as const;

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    heading: 'Librería',
    links: [
      { label: 'Componentes', href: '/componentes' },
      { label: 'Tokens',      href: '/tokens' },
      { label: 'Storybook',   href: ECOSYSTEM.storybook },
    ],
  },
  {
    heading: 'Ecosistema',
    links: [
      { label: 'torii 鳥居',    href: ECOSYSTEM.torii },
      { label: 'hanko 判子',    href: ECOSYSTEM.hanko },
      { label: 'sukashi 透かし', href: ECOSYSTEM.sukashi },
    ],
  },
  {
    heading: 'Recursos',
    links: [
      { label: 'API',       href: ECOSYSTEM.apiDocs },
      { label: 'GitHub',    href: ECOSYSTEM.github },
      { label: 'npm',       href: ECOSYSTEM.npm },
    ],
  },
];

const DEFAULT_NAV_LINKS: FooterLink[] = [
  { label: 'Componentes', href: '/componentes' },
  { label: 'Tokens',      href: '/tokens' },
  { label: 'MIT License', href: `${ECOSYSTEM.github}/blob/main/LICENSE` },
];

const DEFAULT_LEGAL_LINKS: FooterLink[] = [
  { label: 'Ecosistema', href: ECOSYSTEM.torii },
  { label: 'Changelog',  href: ECOSYSTEM.releases },
];

const DEFAULT_RUNTIME_LINES = [
  { key: 'node',  value: 'v22.0.0' },
  { key: 'css',   value: 'pure · no-build' },
  { key: 'fonts', value: 'google CDN' },
  { key: 'deps',  value: '0' },
  { key: 'size',  value: '~180kb total' },
];

const GLITCH_NAV_LINKS: FooterLink[] = [
  { label: 'components.css', href: '/componentes' },
  { label: 'tokens.json',    href: '/tokens' },
  { label: 'changelog.md',   href: ECOSYSTEM.releases },
  { label: 'license.md',     href: `${ECOSYSTEM.github}/blob/main/LICENSE` },
];

export const Footer: React.FC<FooterProps> = ({
  theme        = 'celadon',
  compact      = false,
  brandName    = 'shibui',
  brandKanji   = '渋い',
  brandSub     = 'Design System · Zaragoza',
  location     = 'Zaragoza',
  version      = '1.0.0',
  nodeVersion  = 'v22.0.0',
  githubHref   = ECOSYSTEM.github,
  linkedinHref = '#',
  rssHref      = '#',
  email        = 'hola@shibui.dev',
  columns      = DEFAULT_COLUMNS,
  navLinks     = DEFAULT_NAV_LINKS,
  legalLinks   = DEFAULT_LEGAL_LINKS,
  runtimeLines = DEFAULT_RUNTIME_LINES,
}) => {
  /* La variante glitch usa nav-links distintos por convención */
  const resolvedNavLinks = theme === 'glitch' ? GLITCH_NAV_LINKS : navLinks;

  return (
    <LibFooter
      theme={theme}
      compact={compact}
      brand-name={brandName}
      brand-kanji={brandKanji}
      brand-sub={brandSub}
      location={location}
      version={version}
      node-version={nodeVersion}
      github-href={githubHref}
      linkedin-href={linkedinHref}
      rss-href={rssHref}
      email={email}
      columns={columns}
      navLinks={resolvedNavLinks}
      legalLinks={legalLinks}
      runtimeLines={runtimeLines}
    />
  );
};

export default Footer;