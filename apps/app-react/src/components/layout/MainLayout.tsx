import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { LibButton, LibCheckbox, LibModal, LibRadio } from '@shibui/ui/react';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, activeTab, onTabChange }) => {
  const [activeModal, setActiveModal] = useState<null | 'CV' | 'PROJECT'>(null);
  const [selectedLangs, setSelectedLangs] = useState({ es: false, en: false });

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>

      {/* Pasamos la navegación a la Sidebar */}
      <Sidebar onOpenCV={() => setActiveModal('CV')} activeTab={activeTab} onTabChange={onTabChange} />

      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
        {/* Header ahora más limpio, solo informativo */}
        <header style={{ padding: '0 3rem', height: '70px', backgroundColor: '#fff', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
          <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', fontWeight: 'bold', color: '#888' }}>
            {activeTab}
          </span>
        </header>

        <section style={{ flexGrow: 1, overflowY: 'auto', padding: '2rem 3rem' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {children}
          </div>
        </section>
      </main>

      {activeModal === 'CV' && (
        <LibModal
          heading="Elige idioma"
          open
          _animate="scale"
          variant="default"
          onUiLibModalClose={() => setActiveModal(null)}
        >
          <div className="cv-options">
            <h3>Opciones de Currículum</h3>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px', // Ajusta este valor para más o menos separación
              padding: '1rem 0'
            }}>
              <LibCheckbox label="Español" checked={selectedLangs.es} onChange={(event: CustomEvent) => setSelectedLangs({ ...selectedLangs, es: event.detail.checked })}></LibCheckbox>
              <LibCheckbox label="Ingles" checked={selectedLangs.en} onChange={(event: CustomEvent) => setSelectedLangs({ ...selectedLangs, en: event.detail.checked })}></LibCheckbox>
            </div>



            {/* Contenido del modal */}
          </div>
          <div slot="footer" style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            width: '100%',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <LibButton
              variant="ghost"
              onUiLibClick={() => setActiveModal(null)}
            >
              Cancelar
            </LibButton>

            <LibButton
              variant="primary"
              disabled={!selectedLangs.es && !selectedLangs.en}
              onUiLibClick={() => {
                console.log("Acción: Confirmar descarga de CV");

                const selected = Object.entries(selectedLangs)
                    .filter(([, checked]) => checked)
                    .map(([lang]) => lang === 'en' ? '/cv-alejandro-borbalan-en.pdf' : '/cv-alejandro-borbalan.pdf');

                    const downloadOneByOne = (urls: string[]) => {
                      urls.forEach((url, index) => {
                        // Creamos un delay creciente para cada archivo
                        setTimeout(() => {
                          const link = document.createElement('a');
                          link.href = url;
                          // Forzamos el nombre para que el SO no se confunda
                          link.download = url.split('/').pop() || 'cv.pdf'; 
                          link.style.display = 'none';
                          document.body.appendChild(link);
                          link.click();
                          
                          // Limpiamos el DOM justo después
                          setTimeout(() => {
                            document.body.removeChild(link);
                          }, 100);
                        }, index * 800); // 800ms es el "sweet spot" para que Chrome no bloquee
                      });
                    };
                // Aquí dispararías la lógica de descarga
                downloadOneByOne(selected);
                setSelectedLangs({en:false,es:false})
                setActiveModal(null); // Cerramos tras confirmar
              }}
            >
              Confirmar
            </LibButton>
          </div>
        </LibModal>
      )}


    </div>
  );
};

export default MainLayout;