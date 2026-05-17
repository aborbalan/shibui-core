import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LibSidebar } from '@shibui-ui/ui/react';
import type { SidebarLink } from '@shibui-ui/ui';
import { useAuth } from '../../core/hooks/useAuth';

const SIDEBAR_LINKS: SidebarLink[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'squares-four', group: 'Workspace' },
  { id: 'logout',    label: 'Salir',     icon: 'sign-out',     group: 'Sesión' },
];

export function DashboardLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const activeId = pathname.replace('/', '') || 'dashboard';

  const handleLink = (id: string) => {
    if (id === 'logout') {
      logout();
      navigate('/login');
      return;
    }
    navigate(`/${id === 'dashboard' ? '' : id}`);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <LibSidebar
        user-role="Dev"
        user-name="Shibui"
        brand-name="shibui"
        variant="kintsugi"
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
