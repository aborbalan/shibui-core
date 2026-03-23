import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { LibButton, LibBadge, LibCodeBlock, LibCounter, LibInput, LibCheckbox, LibTabs, LibProgress, LibAlert, LibSkeleton, LibHeader, } from '@shibui/ui/react';
// ─── Style constants ─────────────────────────────────────────
const PREVIEW_ROW = {
    display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '1rem',
};
const MINI_LABEL = {
    fontFamily: 'var(--lib-font-mono)', fontSize: '0.6rem',
    letterSpacing: '0.1em', color: 'rgba(250,247,244,0.25)',
};
const MINI_INPUT_STYLE = {
    fontFamily: 'var(--lib-font-mono)', fontSize: '0.65rem',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    color: 'rgba(250,247,244,0.5)', padding: '0 0.5rem', height: '26px', width: '100%',
};
const KINTSUGI_BADGE_STYLE = {
    background: 'linear-gradient(90deg,#8C4115,#F5D08A,#D97234,#F5D08A,#8C4115)',
    backgroundSize: '200% 100%',
    animation: 'goldShimmer 3s linear infinite',
    color: '#fff', border: 'none',
};
const KINTSUGI_BADGE_STYLE_SM = {
    ...KINTSUGI_BADGE_STYLE, fontSize: '0.55rem', padding: '1px 6px',
};
// ─── Data ────────────────────────────────────────────────────
const COMP_CARDS = [
    {
        num: '✦ Kintsugi · Firma',
        name: 'La cicatriz',
        nameEm: 'de oro',
        desc: 'El principio japonés de reparar con oro. En Shibui, la variante kintsugi aplica gradientes dorados animados y seams que convierten el borde en el elemento más bello del componente.',
        tags: [],
        featured: true,
        preview: (_jsxs("div", { style: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.5rem' }, children: [_jsx(LibBadge, { variant: "accent", style: KINTSUGI_BADGE_STYLE, children: "\u2726 Kintsugi" }), _jsx(LibBadge, { variant: "accent", style: KINTSUGI_BADGE_STYLE_SM, children: "v1.0.0" })] })),
    },
    {
        num: '01–05 · Botones',
        name: 'Buttons',
        desc: 'Primary, outline, ghost, liquid, group y speed dial. Kintsugi y glitch como variantes adicionales.',
        tags: ['Liquid', 'Group', 'Speed Dial'],
        preview: (_jsxs("div", { style: PREVIEW_ROW, children: [_jsx(LibButton, { variant: "primary", size: "sm", children: "Primary" }), _jsx(LibButton, { variant: "ghost", size: "sm", children: "Ghost" })] })),
    },
    {
        num: '28–29 · Formularios',
        name: 'Inputs',
        desc: 'Text inputs, select, checkbox, radio, switch, pin code y rich text editor.',
        tags: ['Pin Code', 'RTE'],
        preview: (_jsxs("div", { style: { ...PREVIEW_ROW, flexDirection: 'column', width: '100%', gap: '0.4rem' }, children: [_jsx(LibInput, { placeholder: "Escribe algo...", style: MINI_INPUT_STYLE }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(LibCheckbox, { size: "sm" }), _jsx("span", { style: MINI_LABEL, children: "Angular" }), _jsx(LibCheckbox, { size: "sm", checked: true }), _jsx("span", { style: MINI_LABEL, children: "React" })] })] })),
    },
    {
        num: '53 · 65 · 66 · Layout',
        name: 'Nav',
        desc: 'Header, sidebar y tabs. Mega-nav, colapsable, icon rail, centrado editorial y kintsugi.',
        tags: ['Shrink', 'Accordion', 'Mega-nav'],
        preview: (_jsx("div", { style: { width: '100%' }, children: _jsx(LibTabs, { variant: "underline", active: "dashboard", items: JSON.stringify([
                    { id: 'dashboard', label: 'Dashboard' },
                    { id: 'analytics', label: 'Analíticas' },
                    { id: 'config', label: 'Config' },
                ]), style: { '--LibTabs-font': 'var(--lib-font-mono)', fontSize: '0.6rem' } }) })),
    },
    {
        num: '11 · 18 · 22 · Feedback',
        name: 'Progress',
        desc: 'Barras de progreso, círculos animados y lectura. Counters con animación y status dots con pulso.',
        tags: ['Circle', 'Reading', 'Counter'],
        preview: (_jsxs("div", { style: { width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }, children: [_jsx(LibProgress, { value: "65", style: { '--LibProgress-color': 'var(--color-kaki-500)' } }), _jsx(LibProgress, { value: "35", style: { '--LibProgress-color': 'var(--color-celadon-400)' } })] })),
    },
    {
        num: '21 · 26 · Tags',
        name: 'Chips',
        desc: 'Chips filtrables, labels de estado y badges de contador con colores semánticos.',
        tags: ['Labels', 'Badges'],
        preview: (_jsxs("div", { style: PREVIEW_ROW, children: [_jsx("lib-chip", { active: true, children: "Angular" }), _jsx("lib-chip", { children: "TypeScript" }), _jsx("lib-chip", { children: "Lit" })] })),
    },
    {
        num: '07 · Identidad',
        name: 'Avatar',
        desc: 'Grupos con overlap, status online, formas square y circle. Kintsugi con anillo dorado.',
        tags: ['Group', 'Status', 'Kintsugi'],
        preview: (_jsxs("div", { style: { display: 'flex' }, children: [['A', 'B', 'C'].map((l, i) => (_jsx("lib-avatar", { name: l, size: "sm", style: { marginLeft: i === 0 ? 0 : '-6px', zIndex: 3 - i } }, l))), _jsx("lib-avatar", { name: "+4", size: "sm", style: { marginLeft: '-6px', zIndex: 0 } })] })),
    },
    {
        num: '39 · Feedback',
        name: 'Callout',
        desc: 'Bloques informativos con variantes info, warning, success y error. Dismissable.',
        tags: ['Warning', 'Success', 'Error'],
        preview: (_jsx("div", { style: { width: '100%' }, children: _jsx(LibAlert, { variant: "warning", style: { fontSize: '0.7rem' }, children: "Componente en beta \u2014 API puede cambiar." }) })),
    },
    {
        num: '49 · Developer',
        name: 'Code',
        desc: 'Bloques de código con botón copy y variante ghost para surfaces claras.',
        tags: ['Copy', 'Ghost'],
        preview: (_jsx("div", { style: { width: '100%' }, children: _jsx(LibCodeBlock, { language: "ts", code: `import '@shibui/ui';` }) })),
    },
    {
        num: '23 · Loading',
        name: 'Skeleton',
        desc: 'Placeholders de carga con shimmer animado. Variantes de texto, tarjeta, avatar y tabla.',
        tags: ['Shimmer', 'Card'],
        preview: (_jsxs("div", { style: { width: '100%', display: 'flex', flexDirection: 'column', gap: '0.35rem' }, children: [_jsx(LibSkeleton, { style: { width: '100%', height: '8px' } }), _jsx(LibSkeleton, { style: { width: '80%', height: '8px' } }), _jsx(LibSkeleton, { style: { width: '60%', height: '8px' } })] })),
    },
    {
        num: '24 · Contextual',
        name: 'Tooltip',
        desc: '8 posiciones, variantes dark y kintsugi, rich content con título y descripción.',
        tags: ['8 posiciones', 'Rich'],
        preview: (_jsx("div", { style: PREVIEW_ROW, children: _jsx("lib-tooltip", { content: "Tooltip \u00B7 top", placement: "top", children: _jsx(LibButton, { variant: "ghost", size: "sm", children: "Hover" }) }) })),
    },
    {
        num: '64 · Onboarding',
        name: 'Tour',
        desc: 'Guía interactiva con spotlight SVG, beacon pulsante, barra de progreso y modal central.',
        tags: ['Spotlight', 'Beacon', 'Kintsugi'],
        preview: (_jsxs("div", { style: PREVIEW_ROW, children: [_jsx(LibBadge, { variant: "accent", children: "1 / 5" }), _jsx("span", { style: MINI_LABEL, children: "Paso actual" })] })),
    },
];
const PILLARS = [
    {
        kanji: '侘',
        name: 'Wabi · Imperfección',
        desc: 'La belleza en lo incompleto e impermanente. Los componentes embracen el estado de transición como parte de la experiencia, no como error a corregir.',
    },
    {
        kanji: '金',
        name: 'Kintsugi · Cicatrices de oro',
        desc: 'Reparar con oro en lugar de ocultar. La variante kintsugi convierte los bordes y las transiciones en el elemento más llamativo del componente.',
    },
    {
        kanji: '間',
        name: 'Ma · El espacio entre',
        desc: 'El espacio negativo como elemento de diseño. El silencio entre notas que hace posible la música. En Shibui, el margen es tan deliberado como el contenido.',
    },
];
const COLOR_SWATCHES = [
    { name: 'washi-950', val: '#120E0A', bg: '#120E0A', border: 'rgba(255,255,255,.08)' },
    { name: 'kaki-500', val: '#B85A1E', bg: '#B85A1E' },
    { name: 'kaki-400', val: '#D97234', bg: '#D97234' },
    { name: 'celadón-400', val: '#4E9482', bg: '#4E9482' },
    { name: 'kintsugi', val: 'gradient', bg: 'linear-gradient(90deg,#B85A1E,#F5D08A,#D97234)' },
];
// ─── Constellation hook ───────────────────────────────────────
function useConstellation(canvasRef) {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        let W = 0, H = 0;
        let rafId = 0;
        const nodes = [];
        const N = 80;
        const resize = () => {
            W = canvas.width = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);
        for (let i = 0; i < N; i++) {
            nodes.push({
                x: Math.random() * (W || 1200),
                y: Math.random() * (H || 800),
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                r: Math.random() * 1.2 + 0.3,
            });
        }
        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            nodes.forEach(n => {
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < 0 || n.x > W)
                    n.vx *= -1;
                if (n.y < 0 || n.y > H)
                    n.vy *= -1;
            });
            const maxDist = 140;
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < maxDist) {
                        ctx.strokeStyle = `rgba(184,90,30,${(1 - d / maxDist) * 0.07})`;
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }
            nodes.forEach(n => {
                ctx.fillStyle = 'rgba(184,90,30,0.2)';
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fill();
            });
            rafId = requestAnimationFrame(draw);
        };
        draw();
        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', resize);
        };
    }, [canvasRef]);
}
// ─── Scroll reveal hook ───────────────────────────────────────
function useScrollReveal() {
    useEffect(() => {
        const els = document.querySelectorAll('[data-reveal]');
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('s-visible');
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.08 });
        els.forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, []);
}
// ─── Sub-components ───────────────────────────────────────────
const SectionLabel = ({ children, delay = 0 }) => (_jsxs("div", { "data-reveal": true, style: {
        fontFamily: 'var(--lib-font-mono)', fontSize: '0.65rem',
        letterSpacing: '0.28em', textTransform: 'uppercase',
        color: 'rgba(184,90,30,0.4)', marginBottom: '1rem',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        transitionDelay: `${delay}s`,
    }, children: [_jsx("span", { style: { width: 24, height: 1, background: 'linear-gradient(90deg,var(--color-kaki-400),transparent)', display: 'block' } }), children] }));
const SectionTitle = ({ children, delay = 0 }) => (_jsx("h2", { "data-reveal": true, style: {
        fontFamily: 'var(--lib-font-display)', fontWeight: 300,
        fontSize: 'clamp(2.5rem,5vw,4.5rem)',
        letterSpacing: '-0.025em', lineHeight: 1.1,
        color: 'rgba(250,247,244,0.65)', marginBottom: '1.5rem',
        transitionDelay: `${delay}s`,
    }, children: children }));
const CompCardEl = ({ card, index }) => (_jsxs("div", { "data-reveal": true, style: {
        padding: '2rem', position: 'relative', overflow: 'hidden',
        cursor: 'default', minHeight: 160,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        border: card.featured ? '0 solid transparent' : 'none',
        borderLeft: card.featured ? '2px solid var(--color-kaki-500)' : undefined,
        gridColumn: card.featured ? 'span 2' : undefined,
        background: card.featured
            ? 'linear-gradient(135deg,rgba(184,90,30,0.08),rgba(184,90,30,0.02))'
            : 'var(--color-washi-950)',
        transitionDelay: `${(index % 4) * 0.05}s`,
    }, children: [_jsxs("div", { children: [_jsx("div", { style: {
                        fontFamily: 'var(--lib-font-mono)', fontSize: '0.6rem',
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                        color: 'rgba(184,90,30,0.3)', marginBottom: '0.75rem',
                    }, children: card.num }), _jsxs("div", { style: {
                        fontFamily: 'var(--lib-font-display)', fontSize: card.featured ? '2rem' : '1.35rem',
                        fontWeight: 300, color: card.featured ? 'var(--color-kaki-400)' : 'rgba(250,247,244,0.5)',
                        letterSpacing: '-0.01em', lineHeight: 1.2, marginBottom: '0.5rem',
                    }, children: [card.name, card.nameEm && (_jsxs(_Fragment, { children: [_jsx("br", {}), _jsx("em", { style: { fontStyle: 'italic', color: 'var(--color-kaki-400)' }, children: card.nameEm })] }))] }), _jsx("div", { style: {
                        fontSize: card.featured ? '0.85rem' : '0.75rem',
                        color: card.featured ? 'rgba(250,247,244,0.3)' : 'rgba(250,247,244,0.2)',
                        lineHeight: 1.7,
                    }, children: card.desc })] }), card.preview, card.tags.length > 0 && (_jsx("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '1.25rem' }, children: card.tags.map(t => (_jsx("span", { style: {
                    fontFamily: 'var(--lib-font-mono)', fontSize: '0.58rem',
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    border: '1px solid rgba(255,255,255,0.07)',
                    padding: '1px 6px', color: 'rgba(250,247,244,0.2)',
                }, children: t }, t))) }))] }));
// ─── Main page ────────────────────────────────────────────────
export const ShibuiHeroPage = () => {
    const canvasRef = useRef(null);
    useConstellation(canvasRef);
    useScrollReveal();
    return (_jsxs(_Fragment, { children: [_jsx("style", { children: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Mono:wght@300;400&family=Shippori+Mincho:wght@400;600&display=swap');

        .shibui-page {
          background: var(--color-washi-950);
          color: var(--color-washi-400);
          font-family: var(--lib-font-body);
          line-height: 1.7;
          overflow-x: hidden;
          min-height: 100vh;
        }
        .shibui-page ::-webkit-scrollbar { width: 4px; }
        .shibui-page ::-webkit-scrollbar-track { background: var(--color-washi-950); }
        .shibui-page ::-webkit-scrollbar-thumb { background: rgba(184,90,30,0.3); }

        /* Scroll reveal */
        [data-reveal] {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s cubic-bezier(0,0,0.2,1), transform 0.7s cubic-bezier(0,0,0.2,1);
        }
        [data-reveal].s-visible { opacity: 1; transform: none; }

        /* Animations */
        @keyframes heroRing    { to { transform: rotate(360deg); } }
        @keyframes seam        { to { background-position: 200% 0; } }
        @keyframes kanjiFloat  {
          0%,100% { transform: translateY(-50%) translateX(0); }
          50%     { transform: translateY(calc(-50% - 20px)) translateX(8px); }
        }
        @keyframes fadeUp      { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }
        @keyframes scrollBounce {
          0%,100% { transform: translateX(-50%) translateY(0); }
          50%     { transform: translateX(-50%) translateY(8px); }
        }
        @keyframes goldShimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes glitchCard {
          0%,88%,100% { transform: none; }
          89% { transform: translateX(-2px); }
          90% { transform: translateX(2px); }
          91% { transform: none; }
        }
        @keyframes seamV {
          0%   { background-position: 0 -100%; }
          100% { background-position: 0 100%; }
        }
        @keyframes easeAnim {
          0%   { transform: scaleX(0); }
          60%, 100% { transform: scaleX(1); }
        }

        /* Hover states para comp-grid */
        .shibui-comp-card { transition: background 0.2s; }
        .shibui-comp-card:hover { background: #1a1108 !important; }
      ` }), _jsxs("div", { className: "shibui-page", children: [_jsx(LibHeader, { variant: "kintsugi", "brand-name": "shibui", "logo-href": "#", "login-label": "Docs", links: [
                            { id: 'componentes', label: 'Componentes', href: '#componentes' },
                            { id: 'filosofia', label: 'Filosofía', href: '#filosofia' },
                            { id: 'variantes', label: 'Variantes', href: '#variantes' },
                            { id: 'tokens', label: 'Tokens', href: '#tokens' },
                        ], actions: [
                            { label: 'Empezar →', href: '#', variant: 'kintsugi' },
                        ], style: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200 } }), _jsxs("section", { style: { position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 clamp(1.5rem,5vw,5rem)', overflow: 'hidden' }, children: [_jsx("canvas", { ref: canvasRef, style: { position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 } }), _jsx("div", { style: {
                                    position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: 0.04,
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
                                } }), _jsx("div", { style: {
                                    position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 10,
                                    background: 'linear-gradient(90deg,transparent 0%,rgba(184,90,30,0.3) 10%,#D97234 30%,#F5D08A 50%,#D97234 70%,rgba(184,90,30,0.3) 90%,transparent 100%)',
                                    backgroundSize: '200% 100%',
                                    animation: 'seam 6s linear infinite',
                                } }), _jsx("div", { style: {
                                    position: 'absolute', right: 'clamp(2rem,8vw,8rem)', top: '50%',
                                    transform: 'translateY(-50%)',
                                    fontFamily: 'var(--lib-font-display)',
                                    fontSize: 'clamp(14rem,28vw,28rem)',
                                    fontWeight: 300, lineHeight: 1,
                                    color: 'rgba(255,255,255,0.022)',
                                    pointerEvents: 'none', userSelect: 'none', zIndex: 1,
                                    animation: 'kanjiFloat 8s ease-in-out infinite',
                                }, children: "\u6E0B" }), _jsxs("div", { style: { position: 'relative', zIndex: 5, maxWidth: 900, paddingTop: 'clamp(5rem,12vh,9rem)', paddingBottom: '4rem' }, children: [_jsxs("div", { style: {
                                            fontFamily: 'var(--lib-font-mono)', fontSize: '0.68rem',
                                            letterSpacing: '0.28em', textTransform: 'uppercase',
                                            color: 'rgba(184,90,30,0.55)', marginBottom: '1.5rem',
                                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                                            opacity: 0, animation: 'fadeUp 0.8s 0.1s cubic-bezier(0,0,0.2,1) forwards',
                                        }, children: [_jsx("span", { style: { width: 32, height: 1, background: 'linear-gradient(90deg,transparent,var(--color-kaki-400))', display: 'block' } }), "Design System \u00B7 v1.0.0 \u00B7 Zaragoza"] }), _jsxs("h1", { style: {
                                            fontFamily: 'var(--lib-font-display)',
                                            fontSize: 'clamp(3.5rem,9vw,9rem)',
                                            fontWeight: 300, lineHeight: 1, letterSpacing: '-0.03em',
                                            color: 'rgba(250,247,244,0.72)', marginBottom: '1.25rem',
                                            opacity: 0, animation: 'fadeUp 0.9s 0.2s cubic-bezier(0,0,0.2,1) forwards',
                                        }, children: ["La belleza", _jsx("br", {}), "de lo", ' ', _jsx("em", { style: { fontStyle: 'italic', color: 'var(--color-kaki-400)', display: 'block' }, children: "austero" })] }), _jsxs("p", { style: {
                                            fontSize: 'clamp(0.85rem,1.5vw,1.05rem)',
                                            color: 'rgba(250,247,244,0.3)', lineHeight: 1.9, maxWidth: 520, marginBottom: '2.5rem',
                                            opacity: 0, animation: 'fadeUp 0.9s 0.35s cubic-bezier(0,0,0.2,1) forwards',
                                        }, children: [_jsx("strong", { style: { color: 'rgba(250,247,244,0.55)', fontWeight: 600 }, children: "66 componentes." }), ' ', "Sin dependencias externas. CSS puro y Web Components bajo principios est\u00E9ticos japoneses \u2014", ' ', _jsx("strong", { style: { color: 'rgba(250,247,244,0.55)', fontWeight: 600 }, children: "wabi-sabi" }), ",", ' ', _jsx("strong", { style: { color: 'rgba(250,247,244,0.55)', fontWeight: 600 }, children: "kintsugi" }), ' ', "y ", _jsx("strong", { style: { color: 'rgba(250,247,244,0.55)', fontWeight: 600 }, children: "ma" }), "."] }), _jsxs("div", { style: {
                                            display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '2.5rem',
                                            opacity: 0, animation: 'fadeUp 0.9s 0.45s cubic-bezier(0,0,0.2,1) forwards',
                                        }, children: [_jsx(LibButton, { variant: "primary", children: "Ver componentes" }), _jsx(LibButton, { variant: "ghost", children: "Leer filosof\u00EDa" })] }), _jsx("div", { style: {
                                            maxWidth: 420, marginBottom: '3rem',
                                            opacity: 0, animation: 'fadeUp 0.9s 0.55s cubic-bezier(0,0,0.2,1) forwards',
                                        }, children: _jsx(LibCodeBlock, { language: "bash", code: "npm install @shibui/ui lit", copyable: true }) }), _jsx("div", { style: {
                                            display: 'flex', gap: 0,
                                            borderTop: '1px solid rgba(255,255,255,0.06)',
                                            paddingTop: '2.5rem',
                                            opacity: 0, animation: 'fadeUp 0.9s 0.6s cubic-bezier(0,0,0.2,1) forwards',
                                        }, children: [
                                            { n: '66', em: '+', label: 'Componentes' },
                                            { n: '0', em: '', label: 'Dependencias' },
                                            { n: '4', em: '×', label: 'Variantes' },
                                            { n: 'MIT', em: '', label: 'Licencia' },
                                        ].map((s, i) => (_jsxs("div", { style: {
                                                paddingRight: '2.5rem', marginRight: '2.5rem',
                                                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                                            }, children: [_jsx(LibCounter, { value: isNaN(Number(s.n)) ? 0 : Number(s.n), style: {
                                                        fontFamily: 'var(--lib-font-display)',
                                                        fontSize: '2.8rem', fontWeight: 300,
                                                        letterSpacing: '-0.02em', lineHeight: 1,
                                                        color: 'rgba(250,247,244,0.65)', display: 'block',
                                                        marginBottom: '0.25rem',
                                                    } }), (isNaN(Number(s.n)) || s.n === '0') && (_jsxs("span", { style: {
                                                        fontFamily: 'var(--lib-font-display)', fontSize: '2.8rem',
                                                        fontWeight: 300, color: 'rgba(250,247,244,0.65)', lineHeight: 1,
                                                        display: 'block', marginBottom: '0.25rem',
                                                    }, children: [s.n, _jsx("em", { style: { fontStyle: 'normal', color: 'var(--color-kaki-400)' }, children: s.em })] })), _jsx("span", { style: {
                                                        fontFamily: 'var(--lib-font-mono)', fontSize: '0.6rem',
                                                        letterSpacing: '0.2em', textTransform: 'uppercase',
                                                        color: 'rgba(250,247,244,0.18)',
                                                    }, children: s.label })] }, s.label))) })] }), _jsxs("div", { style: {
                                    position: 'absolute', bottom: '2.5rem', left: '50%',
                                    transform: 'translateX(-50%)',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                                    zIndex: 5, opacity: 0.4,
                                    animation: 'scrollBounce 2.5s ease-in-out infinite',
                                }, children: [_jsx("span", { style: { fontFamily: 'var(--lib-font-mono)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(250,247,244,0.4)' }, children: "scroll" }), _jsx("div", { style: { width: 1, height: 40, background: 'linear-gradient(180deg,rgba(250,247,244,0.3),transparent)' } })] })] }), _jsx("section", { id: "componentes", style: { padding: 'clamp(5rem,10vh,8rem) clamp(1.5rem,5vw,5rem)' }, children: _jsxs("div", { style: { maxWidth: 1200, margin: '0 auto' }, children: [_jsx(SectionLabel, { children: "66 \u00B7 Componentes" }), _jsxs(SectionTitle, { delay: 0.1, children: ["Todo lo que", _jsx("br", {}), "necesitas, ", _jsx("em", { style: { fontStyle: 'italic', color: 'var(--color-kaki-400)' }, children: "nada m\u00E1s" })] }), _jsx("p", { "data-reveal": true, style: {
                                        fontSize: '0.9rem', color: 'rgba(250,247,244,0.3)',
                                        maxWidth: 560, lineHeight: 1.9, marginBottom: '4rem',
                                        transitionDelay: '0.2s',
                                    }, children: "Cada componente existe porque tiene un prop\u00F3sito claro. Sin ornamento superfluo, sin dependencias. Cuatro variantes est\u00E9ticas: light, dark, kintsugi y glitch." }), _jsx("div", { "data-reveal": true, style: {
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
                                        gap: '1.5px',
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.04)',
                                        transitionDelay: '0.3s',
                                    }, children: COMP_CARDS.map((card, i) => (_jsx(CompCardEl, { card: card, index: i }, card.name))) })] }) }), _jsxs("section", { id: "filosofia", style: {
                            padding: 'clamp(5rem,10vh,8rem) clamp(1.5rem,5vw,5rem)',
                            background: 'rgba(255,255,255,0.018)',
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            position: 'relative', overflow: 'hidden',
                        }, children: [_jsx("div", { style: {
                                    position: 'absolute', right: '-2rem', top: '50%', transform: 'translateY(-50%)',
                                    fontFamily: 'var(--lib-font-display)', fontSize: '30rem', fontWeight: 300,
                                    color: 'rgba(255,255,255,0.012)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
                                }, children: "\u9593" }), _jsxs("div", { style: { maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }, children: [_jsxs("div", { children: [_jsx(SectionLabel, { children: "Filosof\u00EDa" }), _jsxs("blockquote", { "data-reveal": true, style: {
                                                    fontFamily: 'var(--lib-font-display)',
                                                    fontSize: 'clamp(1.6rem,3vw,2.8rem)',
                                                    fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.35,
                                                    color: 'rgba(250,247,244,0.55)',
                                                    transitionDelay: '0.1s',
                                                }, children: ["Lo bello no se anuncia.", _jsx("br", {}), _jsx("em", { style: { fontStyle: 'italic', color: 'var(--color-kaki-400)', display: 'block', marginTop: '0.5rem' }, children: "Se descubre con pausa." }), _jsx("cite", { style: {
                                                            display: 'block', fontStyle: 'normal',
                                                            fontFamily: 'var(--lib-font-mono)', fontSize: '0.65rem',
                                                            letterSpacing: '0.2em', textTransform: 'uppercase',
                                                            color: 'rgba(250,247,244,0.18)', marginTop: '1.5rem',
                                                        }, children: "\u2014 Principio Shibui \u00B7 \u6E0B\u3044" })] })] }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '1.5rem' }, children: PILLARS.map((p, i) => (_jsxs("div", { "data-reveal": true, style: { display: 'flex', gap: '1.25rem', alignItems: 'flex-start', transitionDelay: `${0.1 + i * 0.1}s` }, children: [_jsx("div", { style: {
                                                        fontFamily: 'var(--lib-font-display)', fontSize: '2rem', fontWeight: 300,
                                                        color: 'rgba(184,90,30,0.35)', lineHeight: 1, flexShrink: 0, width: '2.5rem', textAlign: 'center',
                                                    }, children: p.kanji }), _jsxs("div", { children: [_jsx("div", { style: {
                                                                fontFamily: 'var(--lib-font-mono)', fontSize: '0.65rem',
                                                                letterSpacing: '0.2em', textTransform: 'uppercase',
                                                                color: 'rgba(184,90,30,0.5)', marginBottom: '0.35rem',
                                                            }, children: p.name }), _jsx("div", { style: { fontSize: '0.82rem', color: 'rgba(250,247,244,0.25)', lineHeight: 1.8 }, children: p.desc })] })] }, p.kanji))) })] })] }), _jsx("section", { id: "tokens", style: {
                            padding: 'clamp(5rem,10vh,8rem) clamp(1.5rem,5vw,5rem)',
                            background: 'rgba(255,255,255,0.018)',
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                        }, children: _jsxs("div", { style: { maxWidth: 1200, margin: '0 auto' }, children: [_jsx(SectionLabel, { children: "Design Tokens" }), _jsxs(SectionTitle, { delay: 0.1, children: ["El sistema", _jsx("br", {}), _jsx("em", { style: { fontStyle: 'italic', color: 'var(--color-kaki-400)' }, children: "detr\u00E1s del sistema" })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '3rem', marginTop: '4rem' }, children: [_jsxs("div", { "data-reveal": true, children: [_jsx("div", { style: {
                                                        fontFamily: 'var(--lib-font-mono)', fontSize: '0.65rem', letterSpacing: '0.22em',
                                                        textTransform: 'uppercase', color: 'rgba(184,90,30,0.4)',
                                                        marginBottom: '1.25rem', paddingBottom: '0.75rem',
                                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                    }, children: "Colores" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '0.35rem' }, children: COLOR_SWATCHES.map(s => (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.75rem', height: 28 }, children: [_jsx("div", { style: { width: 28, height: 28, flexShrink: 0, background: s.bg, border: s.border } }), _jsx("span", { style: { fontFamily: 'var(--lib-font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(250,247,244,0.2)', flex: 1 }, children: s.name }), _jsx("span", { style: { fontFamily: 'var(--lib-font-mono)', fontSize: '0.58rem', letterSpacing: '0.08em', color: 'rgba(250,247,244,0.12)' }, children: s.val })] }, s.name))) })] }), _jsxs("div", { "data-reveal": true, style: { transitionDelay: '0.1s' }, children: [_jsx("div", { style: {
                                                        fontFamily: 'var(--lib-font-mono)', fontSize: '0.65rem', letterSpacing: '0.22em',
                                                        textTransform: 'uppercase', color: 'rgba(184,90,30,0.4)',
                                                        marginBottom: '1.25rem', paddingBottom: '0.75rem',
                                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                    }, children: "Tipograf\u00EDa" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '1.25rem' }, children: [
                                                        { label: 'Display · Cormorant Garamond', content: _jsxs("span", { style: { fontFamily: 'var(--lib-font-display)', fontSize: '2rem', fontWeight: 300, color: 'rgba(250,247,244,0.45)', letterSpacing: '-0.02em' }, children: ["La belleza ", _jsx("em", { style: { fontStyle: 'italic', color: 'var(--color-kaki-400)' }, children: "austera" })] }) },
                                                        { label: 'Body · Shippori Mincho', content: _jsx("span", { style: { fontFamily: 'var(--lib-font-body)', fontSize: '1rem', color: 'rgba(250,247,244,0.35)', lineHeight: 1.6 }, children: "Sistema de dise\u00F1o basado en principios japoneses." }) },
                                                        { label: 'Mono · DM Mono', content: _jsx("span", { style: { fontFamily: 'var(--lib-font-mono)', fontSize: '0.8rem', color: 'rgba(250,247,244,0.25)', letterSpacing: '0.1em' }, children: "COMPONENT \u00B7 66 \u00B7 v1.0.0" }) },
                                                    ].map(({ label, content }) => (_jsxs("div", { children: [_jsx("div", { style: { fontFamily: 'var(--lib-font-mono)', fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(250,247,244,0.18)', marginBottom: '0.25rem' }, children: label }), content] }, label))) })] }), _jsxs("div", { "data-reveal": true, style: { transitionDelay: '0.2s' }, children: [_jsx("div", { style: {
                                                        fontFamily: 'var(--lib-font-mono)', fontSize: '0.65rem', letterSpacing: '0.22em',
                                                        textTransform: 'uppercase', color: 'rgba(184,90,30,0.4)',
                                                        marginBottom: '1.25rem', paddingBottom: '0.75rem',
                                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                    }, children: "Espaciado \u00B7 Scale" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '0.5rem' }, children: [
                                                        { w: 4, name: 'sp-1 · 0.25rem' },
                                                        { w: 8, name: 'sp-2 · 0.5rem' },
                                                        { w: 16, name: 'sp-4 · 1rem' },
                                                        { w: 24, name: 'sp-6 · 1.5rem' },
                                                        { w: 32, name: 'sp-8 · 2rem' },
                                                        { w: 48, name: 'sp-12 · 3rem' },
                                                        { w: 64, name: 'sp-16 · 4rem' },
                                                        { w: 96, name: 'sp-24 · 6rem' },
                                                    ].map(s => (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.75rem' }, children: [_jsx("div", { style: { width: s.w, height: 8, background: 'rgba(184,90,30,0.25)', flexShrink: 0 } }), _jsx("span", { style: { fontFamily: 'var(--lib-font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(250,247,244,0.2)' }, children: s.name })] }, s.name))) })] })] })] }) }), _jsxs("section", { style: {
                            padding: 'clamp(6rem,14vh,12rem) clamp(1.5rem,5vw,5rem)',
                            position: 'relative', overflow: 'hidden', textAlign: 'center',
                        }, children: [_jsx("div", { style: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(184,90,30,0.06),transparent)', zIndex: 0 } }), _jsx("div", { style: {
                                    position: 'absolute', top: '50%', left: '50%',
                                    transform: 'translate(-50%,-50%)',
                                    width: 600, height: 600, borderRadius: '50%',
                                    border: '1px solid rgba(184,90,30,0.04)',
                                    zIndex: 0, pointerEvents: 'none',
                                } }), _jsxs("div", { style: { position: 'relative', zIndex: 5, maxWidth: 800, margin: '0 auto' }, children: [_jsx("div", { "data-reveal": true, style: { fontFamily: 'var(--lib-font-mono)', fontSize: '0.65rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(184,90,30,0.4)', marginBottom: '1.5rem' }, children: "\u00BFEmpezamos?" }), _jsxs("h2", { "data-reveal": true, style: {
                                            fontFamily: 'var(--lib-font-display)',
                                            fontSize: 'clamp(2.5rem,6vw,6rem)',
                                            fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1.05,
                                            color: 'rgba(250,247,244,0.65)', marginBottom: '1.5rem',
                                            transitionDelay: '0.1s',
                                        }, children: ["Construye con", _jsx("br", {}), _jsx("em", { style: { fontStyle: 'italic', color: 'var(--color-kaki-400)' }, children: "quietud" })] }), _jsx("p", { "data-reveal": true, style: {
                                            fontSize: '0.9rem', color: 'rgba(250,247,244,0.28)',
                                            maxWidth: 480, margin: '0 auto 3rem', lineHeight: 1.9,
                                            transitionDelay: '0.2s',
                                        }, children: "66 componentes listos. Sin instalar nada m\u00E1s. Sin aprender un framework nuevo. Solo CSS, JS y una filosof\u00EDa clara." }), _jsxs("div", { "data-reveal": true, style: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', transitionDelay: '0.3s' }, children: [_jsx(LibButton, { variant: "primary", children: "Ver todos los componentes" }), _jsx(LibButton, { variant: "ghost", children: "Descargar kit Figma" })] }), _jsx("div", { "data-reveal": true, style: { marginTop: '2.5rem', transitionDelay: '0.4s' }, children: _jsx(LibCodeBlock, { language: "bash", code: "npm install @shibui/ui lit", style: { maxWidth: 360, margin: '0 auto' } }) })] })] }), _jsxs("footer", { children: [_jsx("div", { style: {
                                    height: 2,
                                    background: 'linear-gradient(90deg,transparent 0%,rgba(184,90,30,0.3) 10%,#D97234 30%,#F5D08A 50%,#D97234 70%,rgba(184,90,30,0.3) 90%,transparent 100%)',
                                    backgroundSize: '200% 100%',
                                    animation: 'seam 6s linear infinite',
                                } }), _jsxs("div", { style: {
                                    padding: '3rem clamp(1.5rem,5vw,5rem)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    flexWrap: 'wrap', gap: '1.5rem',
                                    maxWidth: 1200, margin: '0 auto',
                                }, children: [_jsxs("div", { style: { fontFamily: 'var(--lib-font-display)', fontSize: '1.1rem', fontWeight: 300, letterSpacing: '0.08em', color: 'rgba(250,247,244,0.3)' }, children: ["shibui ", _jsx("em", { style: { fontStyle: 'italic', color: 'var(--color-kaki-400)' }, children: "\u6E0B\u3044" })] }), _jsx("ul", { style: { display: 'flex', gap: '1.5rem', listStyle: 'none', margin: 0, padding: 0 }, children: ['Componentes', 'Tokens', 'GitHub', 'MIT License'].map(l => (_jsx("li", { children: _jsx("a", { href: "#", style: { fontFamily: 'var(--lib-font-mono)', fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(250,247,244,0.18)', textDecoration: 'none' }, children: l }) }, l))) }), _jsx("div", { style: { fontFamily: 'var(--lib-font-mono)', fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(250,247,244,0.12)' }, children: "\u00A9 2026 \u00B7 Zaragoza \u00B7 v1.0.0" })] })] })] })] }));
};
export default ShibuiHeroPage;
