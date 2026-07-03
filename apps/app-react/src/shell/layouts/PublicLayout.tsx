import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LibBackground } from '@shibui-ui/ui/react';
import ShibuiHeader from '../../components/Header';
import Footer from '../../components/Footer';

/* Ids del header que son secciones de la landing (anclas), no rutas */
const SCROLL_SECTIONS = new Set(['install']);

/* Reintenta hasta que la página lazy haya montado la sección */
function scrollToSection(id: string, tries = 20): void {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  } else if (tries > 0) {
    setTimeout(() => scrollToSection(id, tries - 1), 100);
  }
}

export function PublicLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const activeId = pathname.replace('/', '') || 'home';

  return (
    <LibBackground theme="jade-deep">
      <div style={{ width: '100%', minHeight: '100vh' }}>
        <ShibuiHeader
          showSearch={activeId === 'componentes'}
          theme="celadon"
          onNavLink={(id) => {
            if (SCROLL_SECTIONS.has(id)) {
              if (pathname !== '/') navigate('/');
              scrollToSection(id);
              return;
            }
            navigate(id === 'home' ? '/' : `/${id}`);
          }}
        />
        <Outlet />
        <Footer />
      </div>
    </LibBackground>
  );
}