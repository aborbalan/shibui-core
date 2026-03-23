import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (_jsxs("footer", { style: {
            width: '100%',
            backgroundColor: 'var(--bg-base)',
            borderTop: '1px solid var(--color-washi-800)',
            padding: 'var(--lib-space-2xl) var(--lib-space-xl)',
            marginTop: 'var(--lib-space-3xl)',
            boxSizing: 'border-box'
        }, children: [_jsxs("div", { style: {
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 'var(--lib-space-xl)'
                }, children: [_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-md)' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 'var(--lib-space-sm)' }, children: [_jsx("lib-icon", { name: "stack", size: "24", style: { color: 'var(--color-washi-400)' } }), _jsxs("span", { style: { fontWeight: '700', fontSize: 'var(--text-lg)', letterSpacing: '-0.02em' }, children: ["Shibui ", _jsx("span", { style: { color: 'var(--color-washi-500)' }, children: "UI" })] })] }), _jsx("p", { style: { color: 'var(--color-washi-400)', fontSize: 'var(--text-sm)', lineHeight: '1.6' }, children: "Construyendo un futuro donde la web es ligera, accesible y est\u00E9ticamente equilibrada." })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-md)' }, children: [_jsx("h4", { style: { fontSize: 'var(--text-sm)', textTransform: 'uppercase', color: 'var(--color-washi-500)' }, children: "Librer\u00EDa" }), _jsxs("nav", { style: { display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-xs)' }, children: [_jsx("lib-button", { variant: "ghost", style: { justifyContent: 'flex-start', padding: '0' }, children: "Componentes" }), _jsx("lib-button", { variant: "ghost", style: { justifyContent: 'flex-start', padding: '0' }, children: "Gu\u00EDa de Estilo" }), _jsx("lib-button", { variant: "ghost", style: { justifyContent: 'flex-start', padding: '0' }, children: "Tokens" })] })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-md)' }, children: [_jsx("h4", { style: { fontSize: 'var(--text-sm)', textTransform: 'uppercase', color: 'var(--color-washi-500)' }, children: "Ecosistema" }), _jsxs("nav", { style: { display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-xs)' }, children: [_jsx("lib-button", { variant: "ghost", style: { justifyContent: 'flex-start', padding: '0' }, children: "GitHub" }), _jsx("lib-button", { variant: "ghost", style: { justifyContent: 'flex-start', padding: '0' }, children: "NPM Package" }), _jsx("lib-button", { variant: "ghost", style: { justifyContent: 'flex-start', padding: '0' }, children: "Ejemplos" })] })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-md)' }, children: [_jsx("h4", { style: { fontSize: 'var(--text-sm)', textTransform: 'uppercase', color: 'var(--color-washi-500)' }, children: "Comunidad" }), _jsxs("div", { style: { display: 'flex', gap: 'var(--lib-space-sm)' }, children: [_jsx("lib-button", { variant: "outline", style: { padding: 'var(--lib-space-xs)' }, children: _jsx("lib-icon", { name: "twitter-logo", size: "20" }) }), _jsx("lib-button", { variant: "outline", style: { padding: 'var(--lib-space-xs)' }, children: _jsx("lib-icon", { name: "discord-logo", size: "20" }) })] })] })] }), _jsxs("div", { style: {
                    maxWidth: '1200px',
                    margin: 'var(--lib-space-2xl) auto 0',
                    paddingTop: 'var(--lib-space-lg)',
                    borderTop: '1px solid var(--color-washi-900)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 'var(--lib-space-md)',
                    color: 'var(--color-washi-600)',
                    fontSize: 'var(--text-xs)'
                }, children: [_jsxs("span", { children: ["\u00A9 ", currentYear, " Shibui Studio. Bajo licencia MIT."] }), _jsxs("div", { style: { display: 'flex', gap: 'var(--lib-space-md)' }, children: [_jsx("span", { children: "Privacidad" }), _jsx("span", { children: "T\u00E9rminos" })] })] })] }));
};
