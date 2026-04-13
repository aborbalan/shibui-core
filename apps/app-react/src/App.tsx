import MainLayout from './components/layout/MainLayout';

import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { KitchenSink } from './components/shared/KitchenSink';
import { HomePage } from './components/main/hero';
import { ComponentsPage } from './components/main/components';
import { ICON_REGISTRY } from '@shibui-ui/ui';
import ShibuiHeader from './components/shared/templates/Header';
import Footer from './components/shared/templates/Footer';
import { TokensPage } from './components/main/tokens';

console.log(ICON_REGISTRY);

function App() {

  const [activeId, setActiveId] = useState('home');

  const handleNavigateRoute = (idNav: string) => {
    setActiveId(idNav);
    window.history.pushState({}, '', `/${idNav}`);
  };

  const [currentSection, setCurrentSection] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return ['perfil', 'experiencia', 'proyectos'].includes(hash) ? hash : 'perfil';
  });

  // Función para cambiar de sección y actualizar la URL
  const navigateTo = (section: string) => {
    window.location.hash = section;
    setCurrentSection(section);
  };

  const ROUTES: Record<string, React.ReactNode> = {
    'dev-kitchen-sink': <KitchenSink />,
    'home': <HomePage />,
    'tokens': <TokensPage />,
    'about-me': <HomePage />,
    'componentes': <ComponentsPage />,
    'admin-dashboard': <MainLayout activeTab={currentSection} onTabChange={navigateTo} />,
  };

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['perfil', 'experiencia', 'proyectos'].includes(hash)) {
        setCurrentSection(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);


  return (
    <BrowserRouter>

    <div id="wrap-const-full" ref={wrapperRef} style={{
      width: '100%',
      minHeight: '100vh',
    }}>
      <ShibuiHeader
        showSearch={activeId==='componentes'}
        variant={activeId==='componentes' ? 'app-bar' : 'dark'}
        onNavLink={(id) => handleNavigateRoute(id)}
      />



        <Routes>
          {Object.entries(ROUTES).map(([path, element]) => (
            <Route
              key={path}
              path={path === 'home' ? '/' : `/${path}`}
              element={element}
            />
          ))}

          {/* 2. Ruta por defecto para IDs no encontrados */}
          <Route path="*" element={<HomePage />} />


        </Routes>

      <Footer  />


    </div>
    </BrowserRouter>

  );
}

export default App;