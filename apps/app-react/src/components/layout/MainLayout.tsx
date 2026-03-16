import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { DownloadCVModal } from './modals/DownloadCVModal';
import { Outlet, useLocation } from 'react-router-dom';

interface MainLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ activeTab, onTabChange }) => {
  const [activeModal, setActiveModal] = useState<null | 'CV' | 'PROJECT'>(null);
  const location = useLocation();
  const noSidebarRoutes = ['/login', '/dev-kitchen-sink', '/home'];
  const showSidebar = !noSidebarRoutes.includes(location.pathname);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>

      {showSidebar && (
        <Sidebar onOpenCV={() => setActiveModal('CV')} activeTab={activeTab} onTabChange={onTabChange} />
      )}

      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* Header ahora más limpio, solo informativo */}
        <header style={{ padding: '0 3rem', height: '70px', backgroundColor: '#fff', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
          <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', fontWeight: 'bold', color: '#888' }}>
            {activeTab}
          </span>
        </header>

        <section style={{ flexGrow: 1, overflowY: 'auto', padding: '2rem 3rem' }}>
          <Outlet />
        </section>
      </main>

      {activeModal === 'CV' && (
        <DownloadCVModal isOpen={activeModal !== null} onClose={() => setActiveModal(null)}></DownloadCVModal>
      )}


    </div>
  );
};

export default MainLayout;