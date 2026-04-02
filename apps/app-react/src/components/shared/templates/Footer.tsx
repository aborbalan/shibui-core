import React from 'react';
import { LibFooter } from '@shibui/ui/react';
import { FooterColumn, FooterLink } from '@shibui/ui';

type FooterVariant = 'social' | 'accordion' | 'kintsugi' | 'glitch';

interface FooterProps {
  variant?: FooterVariant;
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

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    heading: 'Librería',
    links: [
      { label: 'Componentes', href: '#' },
      { label: 'Tokens',      href: '#' },
      { label: 'Estilos',     href: '#' },
    ],
  },
  {
    heading: 'Ecosistema',
    links: [
      { label: 'GitHub',     href: '#' },
      { label: 'NPM',        href: '#' },
      { label: 'Storybook',  href: '#' },
    ],
  },
  {
    heading: 'Recursos',
    links: [
      { label: 'Docs',      href: '#' },
      { label: 'Changelog', href: '#' },
      { label: 'Roadmap',   href: '#' },
    ],
  },
];

const DEFAULT_NAV_LINKS: FooterLink[] = [
  { label: 'Componentes', href: '#' },
  { label: 'Tokens',      href: '#' },
  { label: 'MIT License', href: '#' },
];

const DEFAULT_LEGAL_LINKS: FooterLink[] = [
  { label: 'privacy.md', href: '#' },
  { label: 'terms.md',   href: '#' },
];

const DEFAULT_RUNTIME_LINES = [
  { key: 'node',  value: 'v22.0.0' },
  { key: 'css',   value: 'pure · no-build' },
  { key: 'fonts', value: 'google CDN' },
  { key: 'deps',  value: '0' },
  { key: 'size',  value: '~180kb total' },
];

const GLITCH_NAV_LINKS: FooterLink[] = [
  { label: 'components.css', href: '#' },
  { label: 'tokens.json',    href: '#' },
  { label: 'changelog.md',   href: '#' },
  { label: 'license.md',     href: '#' },
];

export const Footer: React.FC<FooterProps> = ({
  variant      = 'dark',
  brandName    = 'shibui',
  brandKanji   = '渋い',
  brandSub     = 'Design System · Zaragoza',
  location     = 'Zaragoza',
  version      = '1.0.0',
  nodeVersion  = 'v22.0.0',
  githubHref   = '#',
  linkedinHref = '#',
  rssHref      = '#',
  email        = 'hola@shibui.dev',
  columns      = DEFAULT_COLUMNS,
  navLinks     = DEFAULT_NAV_LINKS,
  legalLinks   = DEFAULT_LEGAL_LINKS,
  runtimeLines = DEFAULT_RUNTIME_LINES,
}) => {
  /* La variante glitch usa nav-links distintos por convención */
  const resolvedNavLinks = variant === 'glitch' ? GLITCH_NAV_LINKS : navLinks;

  return (
    <LibFooter
      variant={variant}
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