import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Sidebar from './Sidebar';
import { DownloadCVModal } from './modals/DownloadCVModal';
import { Outlet, useLocation } from 'react-router-dom';
const MainLayout = ({ activeTab, onTabChange }) => {
    const [activeModal, setActiveModal] = useState(null);
    const location = useLocation();
    const noSidebarRoutes = ['/login', '/dev-kitchen-sink', '/home'];
    const showSidebar = !noSidebarRoutes.includes(location.pathname);
    return (_jsxs("div", { style: { display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }, children: [showSidebar && (_jsx(Sidebar, { onOpenCV: () => setActiveModal('CV'), activeTab: activeTab, onTabChange: onTabChange })), _jsx("main", { style: { flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }, children: _jsx("section", { style: { flexGrow: 1, overflowY: 'auto' }, children: _jsx(Outlet, {}) }) }), activeModal === 'CV' && (_jsx(DownloadCVModal, { isOpen: activeModal !== null, onClose: () => setActiveModal(null) }))] }));
};
export default MainLayout;
