import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { DownloadCVModal } from './modals/DownloadCVModal';
import { Outlet, useLocation } from 'react-router-dom';
import { LibTabs } from '@shibui/ui/react';

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


        <section style={{ flexGrow: 1, overflowY: 'auto' }}>
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