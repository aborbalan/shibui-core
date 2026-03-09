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

  const DEFAULT_LINKS: SidebarLink[] = [
    { id: 'inicio',      label: 'Inicio',      icon: 'house',        number: '01' },
    { id: 'sobre',       label: 'Sobre mí',    icon: 'user',         number: '02' },
    { id: 'proyectos',   label: 'Proyectos',   icon: 'squares-four', number: '03' },
    { id: 'stack',       label: 'Stack',       icon: 'stack',        number: '04' },
    { id: 'experiencia', label: 'Experiencia', icon: 'timeline',     number: '05' },
    { id: 'contacto',    label: 'Contacto',    icon: 'envelope',     number: '06' },
  ];

  const DEFAULT_SOCIALS: SidebarSocial[] = [
    { href: '#', icon: 'github',   label: 'GitHub' },
    { href: '#', icon: 'linkedin', label: 'LinkedIn' },
    { href: '#', icon: 'dribbble-logo', label: 'Dribbble' },
    { href: '#', icon: 'x-logo',        label: 'X / Twitter' },
  ];

  return (

      <LibSidebar name={meData.name}
                   initials="AB"
                   role="Frontend Developer"
                   status="Disponible para proyectos"
                   active={activeTab}
                   cv-label="Descargar CV"
                   links={DEFAULT_LINKS}
                    socials={DEFAULT_SOCIALS}
                    onUiLibNavigate={(event:CustomEvent) => onTabChange(event.detail.id)}    
                    onUiLibCvClick={onOpenCV}          
                    >

      </LibSidebar>


  );
};

export default Sidebar;