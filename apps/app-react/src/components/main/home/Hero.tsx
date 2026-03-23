import React, { useEffect, useRef } from 'react';
import {
  LibButton,
  LibBadge,
  LibCodeBlock,
  LibCounter,
  LibInput,
  LibCheckbox,
  LibTabs,
  LibProgress,
  LibAlert,
  LibSkeleton,
  LibHeader,
} from '@shibui/ui/react';

// ─── Tipos internos ──────────────────────────────────────────
interface ConstellationNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

interface CompCard {
  num: string;
  name: string;
  nameEm?: string;
  desc: string;
  tags: string[];
  featured?: boolean;
  preview: React.ReactNode;
}

interface Pillar {
  kanji: string;
  name: string;
  desc: string;
}

// ─── Style constants ─────────────────────────────────────────
const PREVIEW_ROW: React.CSSProperties = {
  display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '1rem',
};
const MINI_LABEL: React.CSSProperties = {
  fontFamily: 'var(--lib-font-mono)', fontSize: '0.6rem',
  letterSpacing: '0.1em', color: 'rgba(250,247,244,0.25)',
};
const MINI_INPUT_STYLE: React.CSSProperties = {
  fontFamily: 'var(--lib-font-mono)', fontSize: '0.65rem',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  color: 'rgba(250,247,244,0.5)', padding: '0 0.5rem', height: '26px', width: '100%',
};
const KINTSUGI_BADGE_STYLE: React.CSSProperties = {
  background: 'linear-gradient(90deg,#8C4115,#F5D08A,#D97234,#F5D08A,#8C4115)',
  backgroundSize: '200% 100%',
  animation: 'goldShimmer 3s linear infinite',
  color: '#fff', border: 'none',
};
const KINTSUGI_BADGE_STYLE_SM: React.CSSProperties = {
  ...KINTSUGI_BADGE_STYLE, fontSize: '0.55rem', padding: '1px 6px',
};


// ─── Data ────────────────────────────────────────────────────
const COMP_CARDS: CompCard[] = [
  {
    num: '✦ Kintsugi · Firma',
    name: 'La cicatriz',
    nameEm: 'de oro',
    desc: 'El principio japonés de reparar con oro. En Shibui, la variante kintsugi aplica gradientes dorados animados y seams que convierten el borde en el elemento más bello del componente.',
    tags: [],
    featured: true,
    preview: (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
        <LibBadge variant="accent" style={KINTSUGI_BADGE_STYLE}>✦ Kintsugi</LibBadge>
        <LibBadge variant="accent" style={KINTSUGI_BADGE_STYLE_SM}>v1.0.0</LibBadge>
      </div>
    ),
  },
  {
    num: '01–05 · Botones',
    name: 'Buttons',
    desc: 'Primary, outline, ghost, liquid, group y speed dial. Kintsugi y glitch como variantes adicionales.',
    tags: ['Liquid', 'Group', 'Speed Dial'],
    preview: (
      <div style={PREVIEW_ROW}>
        <LibButton variant="primary" size="sm">Primary</LibButton>
        <LibButton variant="ghost" size="sm">Ghost</LibButton>
      </div>
    ),
  },
  {
    num: '28–29 · Formularios',
    name: 'Inputs',
    desc: 'Text inputs, select, checkbox, radio, switch, pin code y rich text editor.',
    tags: ['Pin Code', 'RTE'],
    preview: (
      <div style={{ ...PREVIEW_ROW, flexDirection: 'column', width: '100%', gap: '0.4rem' }}>
        <LibInput placeholder="Escribe algo..." style={MINI_INPUT_STYLE}></LibInput>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LibCheckbox size="sm"></LibCheckbox>
          <span style={MINI_LABEL}>Angular</span>
          <LibCheckbox size="sm" checked></LibCheckbox>
          <span style={MINI_LABEL}>React</span>
        </div>
      </div>
    ),
  },
  {
    num: '53 · 65 · 66 · Layout',
    name: 'Nav',
    desc: 'Header, sidebar y tabs. Mega-nav, colapsable, icon rail, centrado editorial y kintsugi.',
    tags: ['Shrink', 'Accordion', 'Mega-nav'],
    preview: (
      <div style={{ width: '100%' }}>
        <LibTabs
          variant="underline"
          active="dashboard"
          items={JSON.stringify([
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'analytics', label: 'Analíticas' },
            { id: 'config', label: 'Config' },
          ])}
          style={{ '--LibTabs-font': 'var(--lib-font-mono)', fontSize: '0.6rem' } as React.CSSProperties}
        ></LibTabs>
      </div>
    ),
  },
  {
    num: '11 · 18 · 22 · Feedback',
    name: 'Progress',
    desc: 'Barras de progreso, círculos animados y lectura. Counters con animación y status dots con pulso.',
    tags: ['Circle', 'Reading', 'Counter'],
    preview: (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <LibProgress value="65" style={{ '--LibProgress-color': 'var(--color-kaki-500)' } as React.CSSProperties}></LibProgress>
        <LibProgress value="35" style={{ '--LibProgress-color': 'var(--color-celadon-400)' } as React.CSSProperties}></LibProgress>
      </div>
    ),
  },
  {
    num: '21 · 26 · Tags',
    name: 'Chips',
    desc: 'Chips filtrables, labels de estado y badges de contador con colores semánticos.',
    tags: ['Labels', 'Badges'],
    preview: (
      <div style={PREVIEW_ROW}>
        <lib-chip active>Angular</lib-chip>
        <lib-chip>TypeScript</lib-chip>
        <lib-chip>Lit</lib-chip>
      </div>
    ),
  },
  {
    num: '07 · Identidad',
    name: 'Avatar',
    desc: 'Grupos con overlap, status online, formas square y circle. Kintsugi con anillo dorado.',
    tags: ['Group', 'Status', 'Kintsugi'],
    preview: (
      <div style={{ display: 'flex' }}>
        {['A', 'B', 'C'].map((l, i) => (
          <lib-avatar
            key={l}
            name={l}
            size="sm"
            style={{ marginLeft: i === 0 ? 0 : '-6px', zIndex: 3 - i } as React.CSSProperties}
          ></lib-avatar>
        ))}
        <lib-avatar name="+4" size="sm" style={{ marginLeft: '-6px', zIndex: 0 } as React.CSSProperties}></lib-avatar>
      </div>
    ),
  },
  {
    num: '39 · Feedback',
    name: 'Callout',
    desc: 'Bloques informativos con variantes info, warning, success y error. Dismissable.',
    tags: ['Warning', 'Success', 'Error'],
    preview: (
      <div style={{ width: '100%' }}>
        <LibAlert variant="warning" style={{ fontSize: '0.7rem' }}>
          Componente en beta — API puede cambiar.
        </LibAlert>
      </div>
    ),
  },
  {
    num: '49 · Developer',
    name: 'Code',
    desc: 'Bloques de código con botón copy y variante ghost para surfaces claras.',
    tags: ['Copy', 'Ghost'],
    preview: (
      <div style={{ width: '100%' }}>
        <LibCodeBlock
          language="ts"
          code={`import '@shibui/ui';`}
        />
      </div>
    ),
  },
  {
    num: '23 · Loading',
    name: 'Skeleton',
    desc: 'Placeholders de carga con shimmer animado. Variantes de texto, tarjeta, avatar y tabla.',
    tags: ['Shimmer', 'Card'],
    preview: (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <LibSkeleton style={{ width: '100%', height: '8px' }}></LibSkeleton>
        <LibSkeleton style={{ width: '80%', height: '8px' }}></LibSkeleton>
        <LibSkeleton style={{ width: '60%', height: '8px' }}></LibSkeleton>
      </div>
    ),
  },
  {
    num: '24 · Contextual',
    name: 'Tooltip',
    desc: '8 posiciones, variantes dark y kintsugi, rich content con título y descripción.',
    tags: ['8 posiciones', 'Rich'],
    preview: (
      <div style={PREVIEW_ROW}>
        <lib-tooltip content="Tooltip · top" placement="top">
          <LibButton variant="ghost" size="sm">Hover</LibButton>
        </lib-tooltip>
      </div>
    ),
  },
  {
    num: '64 · Onboarding',
    name: 'Tour',
    desc: 'Guía interactiva con spotlight SVG, beacon pulsante, barra de progreso y modal central.',
    tags: ['Spotlight', 'Beacon', 'Kintsugi'],
    preview: (
      <div style={PREVIEW_ROW}>
        <LibBadge variant="accent">1 / 5</LibBadge>
        <span style={MINI_LABEL}>Paso actual</span>
      </div>
    ),
  },
];

const PILLARS: Pillar[] = [
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
function useConstellation(canvasRef: React.RefObject<HTMLCanvasElement | null>): void {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0;
    let rafId = 0;
    const nodes: ConstellationNode[] = [];
    const N = 80;

    const resize = (): void => {
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

    const draw = (): void => {
      ctx.clearRect(0, 0, W, H);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
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
    return (): void => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [canvasRef]);
}

// ─── Scroll reveal hook ───────────────────────────────────────
function useScrollReveal(): void {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('s-visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    els.forEach(el => obs.observe(el));
    return (): void => obs.disconnect();
  }, []);
}

// ─── Sub-components ───────────────────────────────────────────
const SectionLabel: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <div
    data-reveal
    style={{
      fontFamily: 'var(--lib-font-mono)', fontSize: '0.65rem',
      letterSpacing: '0.28em', textTransform: 'uppercase',
      color: 'rgba(184,90,30,0.4)', marginBottom: '1rem',
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      transitionDelay: `${delay}s`,
    }}
  >
    <span style={{ width: 24, height: 1, background: 'linear-gradient(90deg,var(--color-kaki-400),transparent)', display: 'block' }} />
    {children}
  </div>
);

const SectionTitle: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <h2
    data-reveal
    style={{
      fontFamily: 'var(--lib-font-display)', fontWeight: 300,
      fontSize: 'clamp(2.5rem,5vw,4.5rem)',
      letterSpacing: '-0.025em', lineHeight: 1.1,
      color: 'rgba(250,247,244,0.65)', marginBottom: '1.5rem',
      transitionDelay: `${delay}s`,
    }}
  >
    {children}
  </h2>
);

const CompCardEl: React.FC<{ card: CompCard; index: number }> = ({ card, index }) => (
  <div
    data-reveal
    style={{
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
    } as React.CSSProperties}
  >
    <div>
      <div style={{
        fontFamily: 'var(--lib-font-mono)', fontSize: '0.6rem',
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: 'rgba(184,90,30,0.3)', marginBottom: '0.75rem',
      }}>
        {card.num}
      </div>
      <div style={{
        fontFamily: 'var(--lib-font-display)', fontSize: card.featured ? '2rem' : '1.35rem',
        fontWeight: 300, color: card.featured ? 'var(--color-kaki-400)' : 'rgba(250,247,244,0.5)',
        letterSpacing: '-0.01em', lineHeight: 1.2, marginBottom: '0.5rem',
      }}>
        {card.name}
        {card.nameEm && (
          <><br /><em style={{ fontStyle: 'italic', color: 'var(--color-kaki-400)' }}>{card.nameEm}</em></>
        )}
      </div>
      <div style={{
        fontSize: card.featured ? '0.85rem' : '0.75rem',
        color: card.featured ? 'rgba(250,247,244,0.3)' : 'rgba(250,247,244,0.2)',
        lineHeight: 1.7,
      }}>
        {card.desc}
      </div>
    </div>

    {card.preview}

    {card.tags.length > 0 && (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '1.25rem' }}>
        {card.tags.map(t => (
          <span key={t} style={{
            fontFamily: 'var(--lib-font-mono)', fontSize: '0.58rem',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            border: '1px solid rgba(255,255,255,0.07)',
            padding: '1px 6px', color: 'rgba(250,247,244,0.2)',
          }}>
            {t}
          </span>
        ))}
      </div>
    )}
  </div>
);

// ─── Main page ────────────────────────────────────────────────
export const ShibuiHeroPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useConstellation(canvasRef);
  useScrollReveal();

  return (
    <>
      {/* ── Global styles ── */}
      <style>{`
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
      `}</style>

      <div className="shibui-page">

        {/* ════════════════ NAV ════════════════ */}
        <LibHeader
          variant="kintsugi"
          brand-name="shibui"
          logo-href="#"
          login-label="Docs"
          links={[
            { id: 'componentes', label: 'Componentes', href: '#componentes' },
            { id: 'filosofia', label: 'Filosofía', href: '#filosofia' },
            { id: 'variantes', label: 'Variantes', href: '#variantes' },
            { id: 'tokens', label: 'Tokens', href: '#tokens' },
          ]}
          actions={[
            { label: 'Empezar →', href: '#', variant: 'kintsugi' },
          ]}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200 } as React.CSSProperties}
        />

        {/* ════════════════ HERO ════════════════ */}
        <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 clamp(1.5rem,5vw,5rem)', overflow: 'hidden' }}>
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />

          {/* Grain */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }} />

          {/* Kintsugi seam */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 10,
            background: 'linear-gradient(90deg,transparent 0%,rgba(184,90,30,0.3) 10%,#D97234 30%,#F5D08A 50%,#D97234 70%,rgba(184,90,30,0.3) 90%,transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'seam 6s linear infinite',
          }} />

          {/* Kanji watermark */}
          <div style={{
            position: 'absolute', right: 'clamp(2rem,8vw,8rem)', top: '50%',
            transform: 'translateY(-50%)',
            fontFamily: 'var(--lib-font-display)',
            fontSize: 'clamp(14rem,28vw,28rem)',
            fontWeight: 300, lineHeight: 1,
            color: 'rgba(255,255,255,0.022)',
            pointerEvents: 'none', userSelect: 'none', zIndex: 1,
            animation: 'kanjiFloat 8s ease-in-out infinite',
          }}>
            渋
          </div>

          {/* Hero content */}
          <div style={{ position: 'relative', zIndex: 5, maxWidth: 900, paddingTop: 'clamp(5rem,12vh,9rem)', paddingBottom: '4rem' }}>

            {/* Eyebrow */}
            <div style={{
              fontFamily: 'var(--lib-font-mono)', fontSize: '0.68rem',
              letterSpacing: '0.28em', textTransform: 'uppercase',
              color: 'rgba(184,90,30,0.55)', marginBottom: '1.5rem',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              opacity: 0, animation: 'fadeUp 0.8s 0.1s cubic-bezier(0,0,0.2,1) forwards',
            }}>
              <span style={{ width: 32, height: 1, background: 'linear-gradient(90deg,transparent,var(--color-kaki-400))', display: 'block' }} />
              Design System · v1.0.0 · Zaragoza
            </div>

            {/* Title */}
            <h1 style={{
              fontFamily: 'var(--lib-font-display)',
              fontSize: 'clamp(3.5rem,9vw,9rem)',
              fontWeight: 300, lineHeight: 1, letterSpacing: '-0.03em',
              color: 'rgba(250,247,244,0.72)', marginBottom: '1.25rem',
              opacity: 0, animation: 'fadeUp 0.9s 0.2s cubic-bezier(0,0,0.2,1) forwards',
            }}>
              La belleza<br />de lo{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--color-kaki-400)', display: 'block' }}>
                austero
              </em>
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: 'clamp(0.85rem,1.5vw,1.05rem)',
              color: 'rgba(250,247,244,0.3)', lineHeight: 1.9, maxWidth: 520, marginBottom: '2.5rem',
              opacity: 0, animation: 'fadeUp 0.9s 0.35s cubic-bezier(0,0,0.2,1) forwards',
            }}>
              <strong style={{ color: 'rgba(250,247,244,0.55)', fontWeight: 600 }}>66 componentes.</strong>{' '}
              Sin dependencias externas. CSS puro y Web Components bajo principios estéticos japoneses —{' '}
              <strong style={{ color: 'rgba(250,247,244,0.55)', fontWeight: 600 }}>wabi-sabi</strong>,{' '}
              <strong style={{ color: 'rgba(250,247,244,0.55)', fontWeight: 600 }}>kintsugi</strong>{' '}
              y <strong style={{ color: 'rgba(250,247,244,0.55)', fontWeight: 600 }}>ma</strong>.
            </p>

            {/* Actions */}
            <div style={{
              display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '2.5rem',
              opacity: 0, animation: 'fadeUp 0.9s 0.45s cubic-bezier(0,0,0.2,1) forwards',
            }}>
              <LibButton variant="primary">
                Ver componentes
              </LibButton>
              <LibButton variant="ghost">Leer filosofía</LibButton>
            </div>

            {/* Install code block */}
            <div style={{
              maxWidth: 420, marginBottom: '3rem',
              opacity: 0, animation: 'fadeUp 0.9s 0.55s cubic-bezier(0,0,0.2,1) forwards',
            }}>
              <LibCodeBlock
                language="bash"
                code="npm install @shibui/ui lit"
                copyable
              />
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex', gap: 0,
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: '2.5rem',
              opacity: 0, animation: 'fadeUp 0.9s 0.6s cubic-bezier(0,0,0.2,1) forwards',
            }}>
              {[
                { n: '66', em: '+', label: 'Componentes' },
                { n: '0', em: '', label: 'Dependencias' },
                { n: '4', em: '×', label: 'Variantes' },
                { n: 'MIT', em: '', label: 'Licencia' },
              ].map((s, i) => (
                <div key={s.label} style={{
                  paddingRight: '2.5rem', marginRight: '2.5rem',
                  borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                  <LibCounter
                    value={isNaN(Number(s.n)) ? 0 : Number(s.n)}
                    style={{
                      fontFamily: 'var(--lib-font-display)',
                      fontSize: '2.8rem', fontWeight: 300,
                      letterSpacing: '-0.02em', lineHeight: 1,
                      color: 'rgba(250,247,244,0.65)', display: 'block',
                      marginBottom: '0.25rem',
                    } as React.CSSProperties}
                  />
                  {(isNaN(Number(s.n)) || s.n === '0') && (
                    <span style={{
                      fontFamily: 'var(--lib-font-display)', fontSize: '2.8rem',
                      fontWeight: 300, color: 'rgba(250,247,244,0.65)', lineHeight: 1,
                      display: 'block', marginBottom: '0.25rem',
                    }}>
                      {s.n}<em style={{ fontStyle: 'normal', color: 'var(--color-kaki-400)' }}>{s.em}</em>
                    </span>
                  )}
                  <span style={{
                    fontFamily: 'var(--lib-font-mono)', fontSize: '0.6rem',
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: 'rgba(250,247,244,0.18)',
                  }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{
            position: 'absolute', bottom: '2.5rem', left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
            zIndex: 5, opacity: 0.4,
            animation: 'scrollBounce 2.5s ease-in-out infinite',
          }}>
            <span style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(250,247,244,0.4)' }}>
              scroll
            </span>
            <div style={{ width: 1, height: 40, background: 'linear-gradient(180deg,rgba(250,247,244,0.3),transparent)' }} />
          </div>
        </section>

        {/* ════════════════ COMPONENTS SHOWCASE ════════════════ */}
        <section id="componentes" style={{ padding: 'clamp(5rem,10vh,8rem) clamp(1.5rem,5vw,5rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <SectionLabel>66 · Componentes</SectionLabel>
            <SectionTitle delay={0.1}>
              Todo lo que<br />necesitas, <em style={{ fontStyle: 'italic', color: 'var(--color-kaki-400)' }}>nada más</em>
            </SectionTitle>
            <p data-reveal style={{
              fontSize: '0.9rem', color: 'rgba(250,247,244,0.3)',
              maxWidth: 560, lineHeight: 1.9, marginBottom: '4rem',
              transitionDelay: '0.2s',
            }}>
              Cada componente existe porque tiene un propósito claro. Sin ornamento superfluo, sin dependencias. Cuatro variantes estéticas: light, dark, kintsugi y glitch.
            </p>

            <div data-reveal style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
              gap: '1.5px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.04)',
              transitionDelay: '0.3s',
            }}>
              {COMP_CARDS.map((card, i) => (
                <CompCardEl key={card.name} card={card} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ PHILOSOPHY ════════════════ */}
        <section id="filosofia" style={{
          padding: 'clamp(5rem,10vh,8rem) clamp(1.5rem,5vw,5rem)',
          background: 'rgba(255,255,255,0.018)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Kanji watermark */}
          <div style={{
            position: 'absolute', right: '-2rem', top: '50%', transform: 'translateY(-50%)',
            fontFamily: 'var(--lib-font-display)', fontSize: '30rem', fontWeight: 300,
            color: 'rgba(255,255,255,0.012)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
          }}>
            間
          </div>

          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <div>
              <SectionLabel>Filosofía</SectionLabel>
              <blockquote data-reveal style={{
                fontFamily: 'var(--lib-font-display)',
                fontSize: 'clamp(1.6rem,3vw,2.8rem)',
                fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.35,
                color: 'rgba(250,247,244,0.55)',
                transitionDelay: '0.1s',
              }}>
                Lo bello no se anuncia.<br />
                <em style={{ fontStyle: 'italic', color: 'var(--color-kaki-400)', display: 'block', marginTop: '0.5rem' }}>
                  Se descubre con pausa.
                </em>
                <cite style={{
                  display: 'block', fontStyle: 'normal',
                  fontFamily: 'var(--lib-font-mono)', fontSize: '0.65rem',
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: 'rgba(250,247,244,0.18)', marginTop: '1.5rem',
                }}>
                  — Principio Shibui · 渋い
                </cite>
              </blockquote>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {PILLARS.map((p, i) => (
                <div key={p.kanji} data-reveal style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', transitionDelay: `${0.1 + i * 0.1}s` }}>
                  <div style={{
                    fontFamily: 'var(--lib-font-display)', fontSize: '2rem', fontWeight: 300,
                    color: 'rgba(184,90,30,0.35)', lineHeight: 1, flexShrink: 0, width: '2.5rem', textAlign: 'center',
                  }}>
                    {p.kanji}
                  </div>
                  <div>
                    <div style={{
                      fontFamily: 'var(--lib-font-mono)', fontSize: '0.65rem',
                      letterSpacing: '0.2em', textTransform: 'uppercase',
                      color: 'rgba(184,90,30,0.5)', marginBottom: '0.35rem',
                    }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'rgba(250,247,244,0.25)', lineHeight: 1.8 }}>
                      {p.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ TOKENS ════════════════ */}
        <section id="tokens" style={{
          padding: 'clamp(5rem,10vh,8rem) clamp(1.5rem,5vw,5rem)',
          background: 'rgba(255,255,255,0.018)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <SectionLabel>Design Tokens</SectionLabel>
            <SectionTitle delay={0.1}>
              El sistema<br /><em style={{ fontStyle: 'italic', color: 'var(--color-kaki-400)' }}>detrás del sistema</em>
            </SectionTitle>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '3rem', marginTop: '4rem' }}>

              {/* Colors */}
              <div data-reveal>
                <div style={{
                  fontFamily: 'var(--lib-font-mono)', fontSize: '0.65rem', letterSpacing: '0.22em',
                  textTransform: 'uppercase', color: 'rgba(184,90,30,0.4)',
                  marginBottom: '1.25rem', paddingBottom: '0.75rem',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}>
                  Colores
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {COLOR_SWATCHES.map(s => (
                    <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', height: 28 }}>
                      <div style={{ width: 28, height: 28, flexShrink: 0, background: s.bg, border: s.border }} />
                      <span style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(250,247,244,0.2)', flex: 1 }}>
                        {s.name}
                      </span>
                      <span style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.58rem', letterSpacing: '0.08em', color: 'rgba(250,247,244,0.12)' }}>
                        {s.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Typography */}
              <div data-reveal style={{ transitionDelay: '0.1s' }}>
                <div style={{
                  fontFamily: 'var(--lib-font-mono)', fontSize: '0.65rem', letterSpacing: '0.22em',
                  textTransform: 'uppercase', color: 'rgba(184,90,30,0.4)',
                  marginBottom: '1.25rem', paddingBottom: '0.75rem',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}>
                  Tipografía
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {[
                    { label: 'Display · Cormorant Garamond', content: <span style={{ fontFamily: 'var(--lib-font-display)', fontSize: '2rem', fontWeight: 300, color: 'rgba(250,247,244,0.45)', letterSpacing: '-0.02em' }}>La belleza <em style={{ fontStyle: 'italic', color: 'var(--color-kaki-400)' }}>austera</em></span> },
                    { label: 'Body · Shippori Mincho', content: <span style={{ fontFamily: 'var(--lib-font-body)', fontSize: '1rem', color: 'rgba(250,247,244,0.35)', lineHeight: 1.6 }}>Sistema de diseño basado en principios japoneses.</span> },
                    { label: 'Mono · DM Mono', content: <span style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.8rem', color: 'rgba(250,247,244,0.25)', letterSpacing: '0.1em' }}>COMPONENT · 66 · v1.0.0</span> },
                  ].map(({ label, content }) => (
                    <div key={label}>
                      <div style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(250,247,244,0.18)', marginBottom: '0.25rem' }}>
                        {label}
                      </div>
                      {content}
                    </div>
                  ))}
                </div>
              </div>

              {/* Spacing */}
              <div data-reveal style={{ transitionDelay: '0.2s' }}>
                <div style={{
                  fontFamily: 'var(--lib-font-mono)', fontSize: '0.65rem', letterSpacing: '0.22em',
                  textTransform: 'uppercase', color: 'rgba(184,90,30,0.4)',
                  marginBottom: '1.25rem', paddingBottom: '0.75rem',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}>
                  Espaciado · Scale
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    { w: 4, name: 'sp-1 · 0.25rem' },
                    { w: 8, name: 'sp-2 · 0.5rem' },
                    { w: 16, name: 'sp-4 · 1rem' },
                    { w: 24, name: 'sp-6 · 1.5rem' },
                    { w: 32, name: 'sp-8 · 2rem' },
                    { w: 48, name: 'sp-12 · 3rem' },
                    { w: 64, name: 'sp-16 · 4rem' },
                    { w: 96, name: 'sp-24 · 6rem' },
                  ].map(s => (
                    <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: s.w, height: 8, background: 'rgba(184,90,30,0.25)', flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(250,247,244,0.2)' }}>
                        {s.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════ CTA ════════════════ */}
        <section style={{
          padding: 'clamp(6rem,14vh,12rem) clamp(1.5rem,5vw,5rem)',
          position: 'relative', overflow: 'hidden', textAlign: 'center',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(184,90,30,0.06),transparent)', zIndex: 0 }} />
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 600, height: 600, borderRadius: '50%',
            border: '1px solid rgba(184,90,30,0.04)',
            zIndex: 0, pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 5, maxWidth: 800, margin: '0 auto' }}>
            <div data-reveal style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.65rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(184,90,30,0.4)', marginBottom: '1.5rem' }}>
              ¿Empezamos?
            </div>
            <h2 data-reveal style={{
              fontFamily: 'var(--lib-font-display)',
              fontSize: 'clamp(2.5rem,6vw,6rem)',
              fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1.05,
              color: 'rgba(250,247,244,0.65)', marginBottom: '1.5rem',
              transitionDelay: '0.1s',
            }}>
              Construye con<br />
              <em style={{ fontStyle: 'italic', color: 'var(--color-kaki-400)' }}>quietud</em>
            </h2>
            <p data-reveal style={{
              fontSize: '0.9rem', color: 'rgba(250,247,244,0.28)',
              maxWidth: 480, margin: '0 auto 3rem', lineHeight: 1.9,
              transitionDelay: '0.2s',
            }}>
              66 componentes listos. Sin instalar nada más. Sin aprender un framework nuevo. Solo CSS, JS y una filosofía clara.
            </p>

            <div data-reveal style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', transitionDelay: '0.3s' }}>
              <LibButton variant="primary">
                Ver todos los componentes
              </LibButton>
              <LibButton variant="ghost">Descargar kit Figma</LibButton>
            </div>

            <div data-reveal style={{ marginTop: '2.5rem', transitionDelay: '0.4s' }}>
              <LibCodeBlock
                language="bash"
                code="npm install @shibui/ui lit"
                style={{ maxWidth: 360, margin: '0 auto' } as React.CSSProperties}
              />
            </div>
          </div>
        </section>

        {/* ════════════════ FOOTER ════════════════ */}
        <footer>
          {/* Kintsugi seam */}
          <div style={{
            height: 2,
            background: 'linear-gradient(90deg,transparent 0%,rgba(184,90,30,0.3) 10%,#D97234 30%,#F5D08A 50%,#D97234 70%,rgba(184,90,30,0.3) 90%,transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'seam 6s linear infinite',
          }} />
          <div style={{
            padding: '3rem clamp(1.5rem,5vw,5rem)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '1.5rem',
            maxWidth: 1200, margin: '0 auto',
          }}>
            <div style={{ fontFamily: 'var(--lib-font-display)', fontSize: '1.1rem', fontWeight: 300, letterSpacing: '0.08em', color: 'rgba(250,247,244,0.3)' }}>
              shibui <em style={{ fontStyle: 'italic', color: 'var(--color-kaki-400)' }}>渋い</em>
            </div>
            <ul style={{ display: 'flex', gap: '1.5rem', listStyle: 'none', margin: 0, padding: 0 }}>
              {['Componentes', 'Tokens', 'GitHub', 'MIT License'].map(l => (
                <li key={l}>
                  <a href="#" style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(250,247,244,0.18)', textDecoration: 'none' }}>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
            <div style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(250,247,244,0.12)' }}>
              © 2026 · Zaragoza · v1.0.0
            </div>
          </div>
        </footer>

      </div>
    </>
  );
};

export default ShibuiHeroPage;