
import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import ShibuiHeader from './components/ui/Header';
import Footer from './components/ui/Footer';

const HomePage        = lazy(() => import('./pages/hero').then(m => ({ default: m.HomePage })));
const ComponentsPage  = lazy(() => import('./pages/components').then(m => ({ default: m.ComponentsPage })));
const TokensPage      = lazy(() => import('./pages/tokens').then(m => ({ default: m.TokensPage })));
const KitchenSink     = lazy(() => import('./components/shared/KitchenSink').then(m => ({ default: m.KitchenSink })));

export function AppShell() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Derivado del pathname, sin useState propio
  const activeId = pathname.replace('/', '') || 'home';

  return (
    <div style={{ width: '100%', minHeight: '100vh' }}>
      <ShibuiHeader
        showSearch={activeId === 'componentes'}
        variant={activeId === 'componentes' ? 'app-bar' : 'dark'}
        onNavLink={(id) => navigate(id === 'home' ? '/' : `/${id}`)}
      />

      <Suspense fallback={null}>
        <Routes>
          <Route path="/"                  element={<HomePage />} />
          <Route path="/home"              element={<HomePage />} />
          <Route path="/tokens"            element={<TokensPage />} />
          <Route path="/componentes"       element={<ComponentsPage />} />
          <Route path="/dev-kitchen-sink"  element={<KitchenSink />} />
          <Route path="*"                  element={<HomePage />} />
        </Routes>
      </Suspense>

      <Footer />
    </div>
  );
}