import React from 'react';
import meData from '../../data/me.json';
import { SidebarLink, SidebarSocial } from '@shibui/ui';
import { LibSidebar } from '@shibui/ui/react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenCV: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange,onOpenCV }) => {

  const LINKS: SidebarLink[] = [
    { id: 'dashboard',   label: 'Dashboard',      icon: 'home',         group: 'Principal' },
    { id: 'analytics',   label: 'Analíticas',     icon: 'chart-line',   badge: 12 },
    { id: 'projects',    label: 'Proyectos',      icon: 'folder' },
    { id: 'team',        label: 'Equipo',         icon: 'student',      badge: 4 },
    { id: 'components',  label: 'Componentes',    icon: 'stack',        group: 'Sistema' },
    { id: 'settings',    label: 'Configuración',  icon: 'compass' },
    { id: 'updates',     label: 'Actualizaciones', icon: 'download',    disabled: true },
  ];
  
  const DEFAULT_SOCIALS: SidebarSocial[] = [
    { href: '#', icon: 'github',   label: 'GitHub' },
    { href: '#', icon: 'linkedin', label: 'LinkedIn' },
    { href: '#', icon: 'dribbble-logo', label: 'Dribbble' },
    { href: '#', icon: 'x-logo',        label: 'X / Twitter' },
  ];

  return (



      <LibSidebar  user-role="v0.1.0 · Pro"
                   user-name="Shibui User"
                   role="Frontend Developer"
                   brand-name="shibui"
                   variant="kintsugi"
                   colapsed="true"
                   logo-mark="渋"
                   show-search="true"
                   links={LINKS}
                    >

      </LibSidebar>


  );
};

export default Sidebar;