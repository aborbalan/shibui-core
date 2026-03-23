import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export const ComponentsPage = () => {
    const [selectedComponent, setSelectedComponent] = useState('lib-button');
    return (_jsxs("div", { style: {
            display: 'grid',
            gridTemplateColumns: '280px 1fr', // Sidebar + Contenido
            height: 'calc(100vh - 64px)', // Restamos la altura del Header
            overflow: 'hidden'
        }, children: [_jsxs("aside", { style: {
                    borderRight: '1px solid var(--color-washi-800)',
                    padding: 'var(--lib-space-lg)',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--lib-space-xl)'
                }, children: [_jsxs("div", { children: [_jsx("h3", { style: { fontSize: 'var(--text-xs)', color: 'var(--color-washi-500)', textTransform: 'uppercase' }, children: "Atoms" }), _jsxs("nav", { style: { display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '12px' }, children: [_jsx("lib-button", { variant: "ghost", style: { justifyContent: 'flex-start' }, children: "Button" }), _jsx("lib-button", { variant: "ghost", style: { justifyContent: 'flex-start' }, children: "Icon" }), _jsx("lib-button", { variant: "ghost", style: { justifyContent: 'flex-start' }, children: "Label" })] })] }), _jsxs("div", { children: [_jsx("h3", { style: { fontSize: 'var(--text-xs)', color: 'var(--color-washi-500)', textTransform: 'uppercase' }, children: "Molecules" }), _jsx("nav", { style: { display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '12px' }, children: _jsx("lib-button", { variant: "ghost", style: { justifyContent: 'flex-start' }, children: "Input" }) })] })] }), _jsxs("main", { style: {
                    padding: 'var(--lib-space-2xl)',
                    overflowY: 'auto',
                    backgroundColor: 'var(--color-washi-950)' // Fondo ligeramente más oscuro para resaltar el preview
                }, children: [_jsxs("header", { style: { marginBottom: 'var(--lib-space-2xl)' }, children: [_jsx("lib-label", { variant: "outline", children: "Atoms" }), _jsx("h1", { style: { fontSize: 'var(--text-3xl)', marginTop: 'var(--lib-space-sm)' }, children: "lib-button" }), _jsx("p", { style: { color: 'var(--color-washi-400)' }, children: "El componente base para todas las interacciones de click." })] }), _jsx("section", { style: {
                            backgroundColor: 'var(--bg-base)',
                            borderRadius: 'var(--lib-radius-md)',
                            border: '1px solid var(--color-washi-800)',
                            padding: 'var(--lib-space-3xl)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '300px',
                            position: 'relative'
                        }, children: _jsx("lib-button", { variant: "solid", children: "Interactive Preview" }) }), _jsx("section", { style: { marginTop: 'var(--lib-space-3xl)' }, children: _jsx("h3", { children: "Properties" }) })] })] }));
};
