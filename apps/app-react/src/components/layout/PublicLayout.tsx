import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ShibuiHeader from '../ui/Header';
import Footer from '../ui/Footer';

export function PublicLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const activeId = pathname.replace('/', '') || 'home';

  return (
    <div style={{ width: '100%', minHeight: '100vh' }}>
      <ShibuiHeader
        showSearch={activeId === 'componentes'}
        variant="dark"
        onNavLink={(id) => navigate(id === 'home' ? '/' : `/${id}`)}
      />
      <Outlet />
      <Footer />
    </div>
  );
}