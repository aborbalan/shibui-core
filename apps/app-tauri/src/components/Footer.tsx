import React from 'react';
import { LibFooter } from '@shibui-ui/ui/react';
import type { FooterColumn, FooterLink } from '@shibui-ui/ui';

type FooterVariant = 'social' | 'accordion' | 'kintsugi' | 'glitch' | 'dark';

interface FooterProps {
  variant?: FooterVariant;
  brandName?: string;
  brandKanji?: string;
  brandSub?: string;
  location?: string;
  version?: string;
  columns?: FooterColumn[];
  navLinks?: FooterLink[];
  legalLinks?: FooterLink[];
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
      { label: 'GitHub',    href: '#' },
      { label: 'NPM',       href: '#' },
      { label: 'Storybook', href: '#' },
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

export const Footer: React.FC<FooterProps> = ({
  variant      = 'dark',
  brandName    = 'shibui',
  brandKanji   = '渋い',
  brandSub     = 'Design System · Zaragoza',
  location     = 'Zaragoza',
  version      = '1.0.0',
  columns      = DEFAULT_COLUMNS,
  navLinks     = DEFAULT_NAV_LINKS,
  legalLinks   = DEFAULT_LEGAL_LINKS,
}) => {
  return (
    <LibFooter
      variant={variant}
      brand-name={brandName}
      brand-kanji={brandKanji}
      brand-sub={brandSub}
      location={location}
      version={version}
      columns={columns}
      navLinks={navLinks}
      legalLinks={legalLinks}
    />
  );
};

export default Footer;
