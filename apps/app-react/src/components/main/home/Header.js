import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LibTabs } from '@shibui/ui/react';
export const Header = () => {
    return (_jsx("header", { style: {
            position: 'sticky',
            top: 0,
            zIndex: 100,
            width: '100%',
            backgroundColor: 'rgba(10, 10, 10, 0.8)', // Fondo translúcido (usando oklch de tokens sería ideal)
            backdropFilter: 'blur(12px)', // Efecto cristal
            borderBottom: '1px solid var(--color-washi-800)',
            boxSizing: 'border-box'
        }, children: _jsxs(LibTabs, { color: "kaki", active: "overview", variant: "underline", items: [{ id: 'overview', label: 'Overview' },
                { id: 'code', label: 'Código' },
                { id: 'docs', label: 'Docs' },
                { id: 'issues', label: 'Issues', disabled: true },], children: [_jsxs("div", { children: [_jsx("strong", { children: "Overview" }), " \u2014 Contenido del primer panel."] }), _jsx("div", { slot: "code", children: "<lib-tabs variant=\"underline\" active=\"code\"></lib-tabs>" }), _jsx("div", { slot: "docs", children: "Documentaci\u00F3n \u2014 Navegaci\u00F3n por teclado: \u2190 \u2192 mueve entre tabs." })] }) }));
};
