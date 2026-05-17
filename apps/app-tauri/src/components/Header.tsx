import React from 'react';
import { LibHeader } from '@shibui-ui/ui/react';

export interface NavLink {
  id: string;
  label: string;
  href?: string;
  active?: boolean;
}

export interface HeaderAction {
  label: string;
  href?: string;
  variant?: 'kaki' | 'outline' | 'ghost' | 'kintsugi' | 'glitch';
}

export type HeaderVariant =
  | 'classic'
  | 'dark'
  | 'centered'
  | 'transparent'
  | 'kintsugi'
  | 'glitch'
  | 'mega'
  | 'minimal'
  | 'shrink'
  | 'app-bar';

export interface ShibuiHeaderProps {
  variant?: HeaderVariant;
  logoMark?: string;
  brandName?: string;
  links?: NavLink[];
  actions?: HeaderAction[];
  onNavLink?: (id: string) => void;
  onAction?: (label: string, href?: string) => void;
  className?: string;
  style?: React.CSSProperties;
  showSearch?: boolean;
  searchPlaceholder?: string;
}

const DEFAULT_LINKS: NavLink[] = [
  { id: 'componentes', label: 'Componentes', href: '#componentes' },
  { id: 'tokens',      label: 'Tokens',      href: '#tokens' },
  { id: 'filosofia',   label: 'Filosofía',   href: '/filosofia' },
  { id: 'about',       label: 'Sobre mí',    href: '/about' },
];

const DEFAULT_ACTIONS: HeaderAction[] = [
  { label: 'Empezar →', href: '#', variant: 'kintsugi' },
];

export const ShibuiHeader: React.FC<ShibuiHeaderProps> = ({
  variant = 'kintsugi',
  logoMark = '渋',
  brandName = 'shibui',
  links = DEFAULT_LINKS,
  actions = DEFAULT_ACTIONS,
  onNavLink,
  onAction,
  className,
  style,
  showSearch = false,
  searchPlaceholder = 'Buscar…',
}) => {
  return (
    <LibHeader
      variant={variant}
      logo-mark={logoMark}
      brand-name={brandName}
      links={links}
      actions={actions}
      className={className}
      showSearch={showSearch}
      search-placeholder={searchPlaceholder}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        ...style,
      }}
      onUiLibHeaderLink={(e: CustomEvent) => onNavLink?.(e.detail.id)}
      onUiLibHeaderAction={(e: CustomEvent) => onAction?.(e.detail.label, e.detail.href)}
    />
  );
};

export default ShibuiHeader;
