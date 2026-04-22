import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LibSidebar } from '@shibui-ui/ui/react';
import type { SidebarLink } from '@shibui-ui/ui';
import { useAuth } from '../../hooks/useAuth';

const ADMIN_LINKS: SidebarLink[] = [
  // — Dev Tools —
  { id: 'kitchen-sink', label: 'Kitchen Sink',  icon: 'flask',     group: 'Dev Tools' },
  { id: 'tokens',       label: 'Tokens',        icon: 'palette' },
  { id: 'components',   label: 'Componentes',   icon: 'stack' },
  // — Sistema —
  { id: 'logout',       label: 'Cerrar sesión', icon: 'sign-out',  group: 'Sesión' },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logout } = useAuth();

  // Deriva el id activo del pathname: /admin/kitchen-sink → kitchen-sink
  const activeId = pathname.split('/').pop() ?? 'kitchen-sink';

  
  const handleLink = (id: string) => {
    if (id === 'logout') {
      logout();
      navigate('/');
      return;
    }
    navigate(`/admin/${id}`);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <LibSidebar
        user-role="Admin"
        user-name="Shibui Dev"
        brand-name="shibui"
        variant="kintsugi"
        colapsed="true"
        logo-mark="渋"
        show-search="false"
        links={ADMIN_LINKS}
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