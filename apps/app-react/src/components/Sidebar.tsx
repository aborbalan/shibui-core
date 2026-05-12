import React from 'react';
import { SidebarLink } from '@shibui-ui/ui';
import { LibSidebar } from '@shibui-ui/ui/react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenCV: () => void;
}

const Sidebar: React.FC<SidebarProps> = () => {

  const LINKS: SidebarLink[] = [
    { id: 'dashboard',   label: 'Dashboard',      icon: 'home',         group: 'Principal' },
    { id: 'analytics',   label: 'Analíticas',     icon: 'chart-line',   badge: 12 },
    { id: 'projects',    label: 'Proyectos',      icon: 'folder' },
    { id: 'team',        label: 'Equipo',         icon: 'student',      badge: 4 },
    { id: 'components',  label: 'Componentes',    icon: 'stack',        group: 'Sistema' },
    { id: 'settings',    label: 'Configuración',  icon: 'compass' },
    { id: 'updates',     label: 'Actualizaciones', icon: 'download',    disabled: true },
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