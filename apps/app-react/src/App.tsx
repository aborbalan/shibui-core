import MainLayout from './components/layout/MainLayout';

import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { KitchenSink } from './components/shared/KitchenSink';
import { HomePage } from './components/main/home';
import { ComponentsPage } from './components/main/components';
import { ICON_REGISTRY } from '@shibui/ui';

console.log(ICON_REGISTRY);

function App() {

  const wrapperRef = useRef<HTMLDivElement>(null);

  const [currentSection, setCurrentSection] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return ['perfil', 'experiencia', 'proyectos'].includes(hash) ? hash : 'perfil';
  });


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

  // Función para cambiar de sección y actualizar la URL
  const navigateTo = (section: string) => {
    window.location.hash = section;
    setCurrentSection(section);
  };



  return (

    <div id="wrap-const-full" ref={wrapperRef} style={{
      width: '100%',
      minHeight: '100vh',
    }}>

      <BrowserRouter>
        {/* No ponemos <nav> aquí para que nadie vea el link. 
         Solo tú podrás entrar escribiendo /dev-kitchen-sink en la URL 
      */}

        <Routes>
          <Route path="/dev-kitchen-sink" element={<KitchenSink />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/about-me" element={<HomePage />} />
          <Route path="/components" element={<ComponentsPage />} />
          <Route path="/" element={<MainLayout activeTab={currentSection} onTabChange={navigateTo}/>} />


          {/* Ruta "Escondida" */}



        </Routes>
      </BrowserRouter>




    </div>

  );
}

export default App;