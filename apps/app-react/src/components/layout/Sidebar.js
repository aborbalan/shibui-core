import { jsx as _jsx } from "react/jsx-runtime";
import { LibSidebar } from '@shibui/ui/react';
const Sidebar = ({ activeTab, onTabChange, onOpenCV }) => {
    const LINKS = [
        { id: 'dashboard', label: 'Dashboard', icon: 'home', group: 'Principal' },
        { id: 'analytics', label: 'Analíticas', icon: 'chart-line', badge: 12 },
        { id: 'projects', label: 'Proyectos', icon: 'folder' },
        { id: 'team', label: 'Equipo', icon: 'student', badge: 4 },
        { id: 'components', label: 'Componentes', icon: 'stack', group: 'Sistema' },
        { id: 'settings', label: 'Configuración', icon: 'compass' },
        { id: 'updates', label: 'Actualizaciones', icon: 'download', disabled: true },
    ];
    const DEFAULT_SOCIALS = [
        { href: '#', icon: 'github', label: 'GitHub' },
        { href: '#', icon: 'linkedin', label: 'LinkedIn' },
        { href: '#', icon: 'dribbble-logo', label: 'Dribbble' },
        { href: '#', icon: 'x-logo', label: 'X / Twitter' },
    ];
    return (_jsx(LibSidebar, { "user-role": "v0.1.0 \u00B7 Pro", "user-name": "Shibui User", role: "Frontend Developer", "brand-name": "shibui", variant: "kintsugi", colapsed: "true", "logo-mark": "\u6E0B", "show-search": "true", links: LINKS }));
};
export default Sidebar;
