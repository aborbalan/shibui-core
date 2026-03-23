import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { OrganismsSink } from './OrganismsSink';
import { AtomsSink } from './AtomSink';
import { MoleculesSink } from './MoleculesSink';
export const KitchenSink = () => {
    return (_jsxs("div", { style: {
            width: '100%',
            minHeight: '100vh',
            backgroundColor: 'var(--bg-base)',
            color: 'var(--color-washi-50)',
            padding: 'var(--lib-space-xl)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }, children: [_jsxs("header", { style: { marginBottom: 'var(--lib-space-2xl)' }, children: [_jsx("h1", { style: { fontSize: 'var(--text-3xl)', marginBottom: '0.5rem' }, children: "Kitchen Sink" }), _jsx("p", { style: { color: 'var(--color-washi-400)' }, children: "Refactorizado por niveles de Atomic Design" })] }), _jsxs("main", { style: { display: 'flex', flexDirection: 'column', gap: '4rem' }, children: [_jsx(AtomsSink, {}), _jsx(MoleculesSink, {}), _jsx(OrganismsSink, {})] })] }));
};
