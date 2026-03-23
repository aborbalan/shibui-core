import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Layout Genérico de la Aplicación
 * @description Estructura base con Sidebar opcional y área de contenido scrollable.
 */
export const Layout = ({ sidebar, children }) => {
    return (_jsxs("div", { style: {
            display: 'grid',
            // Si hay sidebar, 280px. si no, 1fr (ocupa todo).
            gridTemplateColumns: sidebar ? '280px 1fr' : '1fr',
            height: 'calc(100vh - 64px)', // Restamos la altura del Header global
            width: '100%',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-base)'
        }, children: [sidebar && (_jsx("aside", { style: {
                    borderRight: '1px solid var(--color-washi-800)',
                    height: '100%',
                    overflowY: 'auto',
                    backgroundColor: 'var(--bg-base)',
                    zIndex: 10
                }, children: sidebar })), _jsx("main", { style: {
                    height: '100%',
                    overflowY: 'auto',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }, children: _jsx("div", { style: {
                        width: '100%',
                        maxWidth: '1200px', // Un poco más ancho para permitir grids de docs
                        padding: 'var(--lib-space-2xl) var(--lib-space-xl)',
                        boxSizing: 'border-box'
                    }, children: children }) })] }));
};
