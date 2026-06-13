import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LibBackground } from '@shibui-ui/ui/react';
import ShibuiHeader from '../../components/Header';
import Footer from '../../components/Footer';

export function PublicLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const activeId = pathname.replace('/', '') || 'home';

  return (
    <LibBackground theme="celadon-wash">
      <div style={{ width: '100%', minHeight: '100vh' }}>
        <ShibuiHeader
          showSearch={activeId === 'componentes'}
          theme="celadon"
          onNavLink={(id) => navigate(id === 'home' ? '/' : `/${id}`)}
        />
        <Outlet />
        <Footer />
      </div>
    </LibBackground>
  );
}