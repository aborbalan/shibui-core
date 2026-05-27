import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-carousel.component';
import type { LibCarousel } from './lib-carousel.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

type CarouselArgs = Pick<LibCarousel, 'mode' | 'peek' | 'arrows' | 'dots' | 'counter' | 'loop' | 'autoplay'>;

const meta: Meta<CarouselArgs> = {
  title: 'Web/Motion/Carousel',
  tags:['autodocs'],
  component: 'lib-carousel',
  argTypes: {
    mode:     { control: 'select', options: ['slide', 'fade'] },
    peek:     { control: 'number', min: 1, max: 4 },
    arrows:   { control: 'boolean' },
    dots:     { control: 'boolean' },
    counter:  { control: 'boolean' },
    loop:     { control: 'boolean' },
    autoplay: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<CarouselArgs>;

/* ── Shared slide content ── */
const JAPAN_SLIDES = [
  { src: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80', label: 'Kioto · Japón', title: 'Fushimi Inari, <em>el camino de los torii</em>' },
  { src: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=1200&q=80', label: 'Hakone · Japón', title: 'El Fuji entre <em>la niebla de marzo</em>' },
  { src: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&q=80', label: 'Tokio · Japón', title: 'Shibuya, <em>cruce de destinos</em>' },
  { src: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80', label: 'Nara · Japón', title: 'Tōdai-ji, <em>guardianes de bronce</em>' },
];

const slideStyle = `
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
  background: var(--color-washi-200);
`;

const captionStyle = `
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 32px 32px 24px;
  background: linear-gradient(to top, rgba(26,20,14,0.7) 0%, transparent 100%);
`;

/* ── Playground ── */
export const Playground: Story = {
  args: { mode: 'slide', peek: 1, arrows: true, dots: true, counter: false, loop: false, autoplay: 0 },
  render: (args): TemplateResult => html`
    <div style="max-width:720px; margin:40px auto; padding:0 24px;">
      <lib-carousel
        mode=${args.mode}
        peek=${args.peek}
        ?arrows=${args.arrows}
        ?dots=${args.dots}
        ?counter=${args.counter}
        ?loop=${args.loop}
        autoplay=${args.autoplay}
        @ui-lib-slide-change=${(e: CustomEvent<{current:number;total:number}>):void => console.log('slide-change', e.detail)}
      >
        ${JAPAN_SLIDES.map((s, i) => html`
          <div style=${slideStyle}>
            <img src=${s.src} alt=${s.label} style="width:100%;height:100%;object-fit:cover;display:block;">
            <div style=${captionStyle}>
              <p style="font-family:var(--lib-font-mono);font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.5);margin-bottom:4px;">${s.label}</p>
              <h3 style="font-family:var(--lib-font-display);font-size:2rem;font-weight:300;color:#fff;line-height:1.2;" .innerHTML=${'0' + (i+1) + ' — ' + s.title}></h3>
            </div>
          </div>
        `)}
      </lib-carousel>
    </div>
  `,
};

/* ── Default — full bleed con caption ── */
export const DefaultSlide: Story = {
  name: 'Slide — Full bleed con caption',
  render: (): TemplateResult => html`
    <div style="max-width:800px; margin:40px auto; padding:0 24px;">
      <lib-carousel dots counter>
        ${JAPAN_SLIDES.map((s, i) => html`
          <div style=${slideStyle}>
            <img src=${s.src} alt=${s.label} style="width:100%;height:100%;object-fit:cover;display:block;">
            <div style=${captionStyle}>
              <p style="font-family:var(--lib-font-mono);font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.5);margin-bottom:4px;">${s.label}</p>
              <h3 style="font-family:var(--lib-font-display);font-size:2rem;font-weight:300;color:#fff;line-height:1.2;" .innerHTML=${'0' + (i+1) + ' — ' + s.title}></h3>
            </div>
          </div>
        `)}
      </lib-carousel>
    </div>
  `,
};

/* ── Cards — peek=3 ── */
const CARDS = [
  { category: 'Espacios',   title: 'Sala de meditación minimalista',        sub: 'Artículo · 4 min', src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80' },
  { category: 'Diseño',     title: 'Tokens de color en sistemas maduros',   sub: 'Guía · 8 min',     src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80' },
  { category: 'Perfil',     title: 'La disciplina del espacio en blanco',   sub: 'Entrevista · 6 min',src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80' },
  { category: 'Tipografía', title: 'Fuentes japonesas para interfaces',     sub: 'Análisis · 10 min', src: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=600&q=80' },
  { category: 'Materiales', title: 'Cerámica raku y diseño de componentes', sub: 'Ensayo · 5 min',    src: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?w=600&q=80' },
  { category: 'Proceso',    title: 'Wabi-sabi como filosofía de producto',  sub: 'Reflexión · 7 min', src: 'https://images.unsplash.com/photo-1431440869543-efaf3388c585?w=600&q=80' },
];

export const CardsCarousel: Story = {
  name: 'Cards — 3 columnas con peek',
  render: (): TemplateResult => html`
    <div style="max-width:960px; margin:40px auto; padding:0 24px;">
      <lib-carousel peek="3" counter>
        ${CARDS.map(c => html`
          <div style="border:1px solid var(--border-subtle); background:var(--bg-elevated); overflow:hidden;">
            <div style="aspect-ratio:4/3; overflow:hidden; background:var(--color-washi-100);">
              <img src=${c.src} alt="" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform 350ms ease-out;">
            </div>
            <div style="padding:20px 20px 24px;">
              <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:var(--text-accent);margin-bottom:8px;">${c.category}</p>
              <h4 style="font-family:var(--lib-font-display);font-size:var(--text-lg);font-weight:300;color:var(--text-primary);line-height:1.4;letter-spacing:-0.02em;margin-bottom:8px;">${c.title}</h4>
              <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.08em;color:var(--text-muted);">${c.sub}</p>
            </div>
          </div>
        `)}
      </lib-carousel>
    </div>
  `,
};

/* ── Testimonial fade — solo dots ── */
const TESTIMONIALS = [
  { quote: 'El buen diseño no se nota. Es el aire de la sala: cuando no está, se asfixia; cuando está, ni siquiera lo recuerdas.', name: 'Alejandro Borbalán', role: 'Senior Front-End Developer', avatar: 'https://i.pravatar.cc/80?img=11' },
  { quote: 'Ma (間) no es ausencia. Es el espacio que hace posible que algo ocurra. En interfaz lo llamamos margen, pero es mucho más que eso.', name: 'Marta Ruiz', role: 'Product Designer', avatar: 'https://i.pravatar.cc/80?img=22' },
  { quote: 'Los tokens no son solo variables. Son el vocabulario compartido que permite que un equipo hable el mismo idioma sin decir una sola palabra.', name: 'Carlos Vega', role: 'Design Systems Lead', avatar: 'https://i.pravatar.cc/80?img=33' },
];

export const TestimonialFade: Story = {
  name: 'Fade — Testimonial (solo dots)',
  render: (): TemplateResult => html`
    <div style="max-width:720px; margin:40px auto; padding:0 24px;">
      <lib-carousel mode="fade" ?arrows=${false} dots>
        ${TESTIMONIALS.map(t => html`
          <div style="padding:48px 64px; background:var(--bg-surface); border:1px solid var(--border-subtle); display:flex; flex-direction:column; gap:32px;">
            <p style="font-family:var(--lib-font-display);font-size:2rem;font-weight:300;line-height:1.4;letter-spacing:-0.02em;color:var(--text-primary);font-style:italic;">
              <span style="color:var(--color-kaki-300);font-size:1.5em;line-height:0;vertical-align:-0.35em;margin-right:4px;">"</span>${t.quote}
            </p>
            <div style="display:flex;align-items:center;gap:16px;">
              <img src=${t.avatar} alt=${t.name} style="width:40px;height:40px;border-radius:9999px;object-fit:cover;border:1px solid var(--border-subtle);">
              <div>
                <p style="font-family:var(--lib-font-body);font-size:var(--text-sm);color:var(--text-primary);">${t.name}</p>
                <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.08em;color:var(--text-muted);">${t.role}</p>
              </div>
            </div>
          </div>
        `)}
      </lib-carousel>
    </div>
  `,
};

/* ── Fade + thumbnails ── */
export const FadeWithThumbs: Story = {
  name: 'Fade — Con tira de miniaturas',
  render: (): TemplateResult => html`
    <div style="max-width:720px; margin:40px auto; padding:0 24px;">
      <lib-carousel mode="fade" ?arrows=${false} ?dots=${false}>

        ${JAPAN_SLIDES.map((s, i) => html`
          <div style="position:relative;aspect-ratio:16/7;overflow:hidden;background:var(--color-washi-200);">
            <img src=${s.src} alt=${s.label} style="width:100%;height:100%;object-fit:cover;display:block;">
            <div style=${captionStyle}>
              <p style="font-family:var(--lib-font-mono);font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.5);margin-bottom:4px;">0${i+1} / 04</p>
              <h3 style="font-family:var(--lib-font-display);font-size:1.5rem;font-weight:300;color:#fff;line-height:1.2;font-style:italic;" .innerHTML=${s.title}></h3>
            </div>
          </div>
        `)}

        ${JAPAN_SLIDES.map(s => html`
          <img slot="thumbnail" src=${s.src.replace('w=1200', 'w=200')} alt="">
        `)}

      </lib-carousel>
    </div>
  `,
};

/* ── Autoplay + loop ── */
export const AutoplayLoop: Story = {
  name: 'Autoplay — Loop cada 3 s',
  render: (): TemplateResult => html`
    <div style="max-width:720px; margin:40px auto; padding:0 24px;">
      <lib-carousel dots loop autoplay="3000">
        ${JAPAN_SLIDES.map(s => html`
          <div style=${slideStyle}>
            <img src=${s.src} alt=${s.label} style="width:100%;height:100%;object-fit:cover;display:block;">
          </div>
        `)}
      </lib-carousel>
    </div>
  `,
};

/* ═══════════════════════════════════════════════════════════════
   KATACHI · 形 · Las 6 historias estándar
   lib-carousel usa tokens semánticos de borde y superficie
   (bg-elevated, border-subtle, text-primary) — adapta al katachi.
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<object>(() => html`
  <div style="display:flex;flex-direction:column;gap:var(--lib-space-lg);max-width:560px;">

    <!-- Slide mode — arrows + dots + counter -->
    <div>
      <p style="font-family:var(--lib-font-mono);font-size:9px;color:var(--text-muted);letter-spacing:.16em;text-transform:uppercase;margin-bottom:var(--lib-space-xs);">slide · arrows · dots · counter</p>
      <lib-carousel dots counter>
        ${[
          { label: '侘び · Wabi',   bg: 'var(--bg-elevated)' },
          { label: '寂び · Sabi',   bg: 'var(--bg-surface)' },
          { label: '自然 · Shizen', bg: 'var(--bg-elevated)' },
          { label: '青磁 · Celadon', bg: 'var(--bg-base)' },
        ].map(s => html`
          <div style="aspect-ratio:16/6;display:flex;align-items:center;justify-content:center;background:${s.bg};border:1px solid var(--border-subtle);">
            <span style="font-family:var(--lib-font-display);font-size:1.1rem;font-weight:300;color:var(--text-primary);letter-spacing:-.02em;">${s.label}</span>
          </div>
        `)}
      </lib-carousel>
    </div>

    <!-- Fade mode — dots only -->
    <div>
      <p style="font-family:var(--lib-font-mono);font-size:9px;color:var(--text-muted);letter-spacing:.16em;text-transform:uppercase;margin-bottom:var(--lib-space-xs);">fade · dots only</p>
      <lib-carousel mode="fade" ?arrows=${false} dots>
        ${[
          { label: '金継ぎ · Kintsugi', note: 'Belleza en las grietas' },
          { label: '渋い · Shibui',    note: 'Elegancia discreta' },
          { label: '間 · Ma',          note: 'El espacio entre' },
        ].map(s => html`
          <div style="padding:var(--lib-space-xl);background:var(--bg-surface);border:1px solid var(--border-subtle);display:flex;flex-direction:column;gap:var(--lib-space-xs);min-height:100px;">
            <div style="font-family:var(--lib-font-display);font-size:var(--text-lg);font-weight:300;color:var(--text-primary);">${s.label}</div>
            <div style="font-family:var(--lib-font-mono);font-size:var(--text-xs);color:var(--text-muted);">${s.note}</div>
          </div>
        `)}
      </lib-carousel>
    </div>

    <!-- Peek 3 — cards -->
    <div>
      <p style="font-family:var(--lib-font-mono);font-size:9px;color:var(--text-muted);letter-spacing:.16em;text-transform:uppercase;margin-bottom:var(--lib-space-xs);">peek 3 · cards</p>
      <lib-carousel peek="3" counter>
        ${(['Atoms', 'Molecules', 'Organisms', 'Tokens', 'Katachi'] as const).map(c => html`
          <div style="border:1px solid var(--border-subtle);background:var(--bg-elevated);padding:var(--lib-space-md);">
            <p style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--text-muted);margin-bottom:var(--lib-space-xs);">${c}</p>
            <div style="font-family:var(--lib-font-display);font-size:var(--text-sm);font-weight:300;color:var(--text-primary);">Shibui DS</div>
          </div>
        `)}
      </lib-carousel>
    </div>

  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;