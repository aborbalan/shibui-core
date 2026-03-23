import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Header } from './Header';
import { Footer } from './Footer';
import HeroIntro from '../../layout/templates/HeroIntro';
export const HomePage = () => {
    return (_jsxs("div", { style: {
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
        }, children: [_jsx(Header, {}), _jsx("main", { style: { flex: 1 }, children: _jsx(HeroIntro, { onPrimary: () => document.querySelector('#componentes')?.scrollIntoView({ behavior: 'smooth' }), onGhost: () => document.querySelector('#filosofia')?.scrollIntoView({ behavior: 'smooth' }) }) }), _jsx(Footer, {})] }));
};
