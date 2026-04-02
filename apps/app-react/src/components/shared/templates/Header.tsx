import React from 'react';
import { LibHeader } from '@shibui/ui/react';

// ─── Tipos re-exportados para que el consumidor no importe de Lit ─────────────
export interface NavLink {
  id:       string;
  label:    string;
  href?:    string;
  active?:  boolean;
  dropdown?: DropdownItem[];
}

export interface DropdownItem {
  label:    string;
  href?:    string;
  divider?: boolean;
}

export interface HeaderAction {
  label:    string;
  href?:    string;
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
  /** Variante visual del header. Default: 'kintsugi' */
  variant?:      HeaderVariant;
  /** Carácter del logo mark. Default: '渋' */
  logoMark?:     string;
  /** Nombre de marca. Default: 'shibui' */
  brandName?:    string;
  /** Subtítulo del logo (solo variante shrink) */
  brandTagline?: string;
  /** URL del logo */
  logoHref?:     string;
  /** Badge de versión (solo variante dark) */
  version?:      string;
  /** Links de navegación principal */
  links?:        NavLink[];
  /** Botones CTA del lado derecho */
  actions?:      HeaderAction[];
  /** Texto del link de login */
  loginLabel?:   string;
  /** URL del link de login */
  loginHref?:    string;
  /** Callback cuando se hace click en un nav link */
  onNavLink?:    (id: string) => void;
  /** Callback cuando se hace click en un action */
  onAction?:     (label: string, href?: string) => void;
  /** className adicional para el host */
  className?:    string;
  /** style adicional para el host */
  style?:        React.CSSProperties;
  /** Muestra la barra de búsqueda */
  showSearch?:   boolean;
  /** Placeholder de la barra de búsqueda */
  searchPlaceholder?: string;
}

// ─── Links por defecto del design system ─────────────────────────────────────
const DEFAULT_LINKS: NavLink[] = [
  { id: 'componentes', label: 'Componentes', href: '#componentes' },
  { id: 'tokens',      label: 'Tokens',      href: '#tokens'      },
  { id: 'filosofia',   label: 'Filosofía',   href: '#filosofia'   },
];

const DEFAULT_ACTIONS: HeaderAction[] = [
  { label: 'Empezar →', href: '#', variant: 'kintsugi' },
];

// ─── Componente ───────────────────────────────────────────────────────────────
export const ShibuiHeader: React.FC<ShibuiHeaderProps> = ({
  variant      = 'kintsugi',
  logoMark     = '渋',
  brandName    = 'shibui',
  brandTagline,
  logoHref     = '#',
  version,
  links        = DEFAULT_LINKS,
  actions      = DEFAULT_ACTIONS,
  loginLabel,
  loginHref,
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
      brand-tagline={brandTagline ?? ''}
      logo-href={logoHref}
      version={version ?? ''}
      login-label={loginLabel ?? ''}
      login-href={loginHref ?? ''}
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