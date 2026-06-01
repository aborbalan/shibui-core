import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LibSidebar } from '@shibui-ui/ui/react';
import type { SidebarLink } from '@shibui-ui/ui';
import { useAuth } from '../../core/hooks/useAuth';

const SIDEBAR_LINKS: SidebarLink[] = [
  { id: '',          label: 'Hub',       icon: 'house-simple', group: 'Workspace' },
  { id: 'workspace', label: 'Workspace', icon: 'squares-four', group: 'Workspace' },
  { id: 'code',      label: 'Code',      icon: 'code',         group: 'Workspace' },
  { id: 'files',     label: 'Files',     icon: 'folder-open',  group: 'Workspace' },
  { id: 'security',  label: 'Security',  icon: 'shield-check', group: 'Workspace' },
  { id: 'settings',  label: 'Settings',  icon: 'gear-six',     group: 'Workspace' },
  { id: 'logout',    label: 'Salir',     icon: 'sign-out',     group: 'Sesión' },
];

export function DashboardLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const activeId = pathname.replace('/', '');

  const handleLink = (id: string) => {
    if (id === 'logout') {
      logout();
      navigate('/login');
      return;
    }
    navigate(`/${id}`);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <LibSidebar
        user-role="Dev"
        user-name="Shibui"
        brand-name="shibui"
        variant="terminal"
        colapsed="true"
        logo-mark="渋"
        show-search="false"
        links={SIDEBAR_LINKS}
        active-id={activeId}
        onUiLibSidebarLink={(e: CustomEvent<{ id: string }>) => handleLink(e.detail.id)}
      />

      <main style={{
        flexGrow: 1,
        height: '100vh',
        overflowY: 'auto',
        backgroundColor: 'var(--bg-base)',
      }}>
        <Outlet />
      </main>
    </div>
  );
}
