import MainLayout from './components/layout/MainLayout';
import ProfileSection from './components/organisms/ProfileSection';
import ProjectGallery from './components/layout/ProjectGallery';
import { useEffect, useState } from 'react';

function App() {


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
    <MainLayout onOpenCV={() => setShowCVOptions(true)} activeTab={currentSection} onTabChange={navigateTo}>
      {/* Bloque 1: Perfil profesional (LinkedIn Style) */}
      {currentSection === 'perfil' && <ProfileSection />}
    {currentSection === 'proyectos' && <ProjectGallery />}
    {currentSection === 'experiencia' && <div style={{ padding: '2rem' }}>Sección Experiencia</div>}
    </MainLayout>
  );
}

export default App;