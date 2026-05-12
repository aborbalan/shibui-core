import { html, type TemplateResult } from 'lit';
import type { LibFooter } from './lib-footer.component';

/* ── SVG helpers inline ── */
const ICON_GITHUB = html`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>`;
const ICON_LINKEDIN = html`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>`;
const ICON_EMAIL = html`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`;
const ICON_RSS = html`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M4 11a9 9 0 019 9"/><path d="M4 4a16 16 0 0116 16"/><circle cx="5" cy="19" r="1" fill="currentColor" stroke="none"/></svg>`;
const ICON_CHEVRON_DOWN = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>`;
const ICON_ARROW_SM = html`<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;

/* ────────────────────────────────────────────────────────────
   01 · SOCIAL PROMINENT
   ──────────────────────────────────────────────────────────── */
export function renderSocial(ctx: LibFooter): TemplateResult {
  return html`
    <footer>
      <div class="ft-inner">

        <!-- Brand centered -->
        <div style="text-align:center;margin-bottom:var(--lib-space-xl,2rem);">
          <div class="ft-brand" style="font-size:2rem;">
            ${ctx.brandName} <em>${ctx.brandKanji}</em>
          </div>
          <span class="ft-brand-sub">${ctx.brandSub}</span>
        </div>

        <!-- Social grid large -->
        <div class="ft-social-grid">
          <a href="${ctx.githubHref}" class="ft-social-cell" aria-label="GitHub" style="color:var(--color-washi-500,#9A8878);">
            ${ICON_GITHUB}
            <span class="ft-social-cell-label">GitHub</span>
          </a>
          <a href="${ctx.linkedinHref}" class="ft-social-cell" aria-label="LinkedIn" style="color:var(--color-washi-500,#9A8878);">
            ${ICON_LINKEDIN}
            <span class="ft-social-cell-label">LinkedIn</span>
          </a>
          <a href="mailto:${ctx.email}" class="ft-social-cell accent" aria-label="Email" style="color:var(--color-kaki-400,#D97234);">
            ${ICON_EMAIL}
            <span class="ft-social-cell-label">Email</span>
          </a>
          <a href="${ctx.rssHref}" class="ft-social-cell" aria-label="RSS" style="color:var(--color-washi-500,#9A8878);">
            ${ICON_RSS}
            <span class="ft-social-cell-label">RSS</span>
          </a>
        </div>

        <!-- Nav + copyright -->
        <div class="ft-nav-row">
          <ul class="ft-nav-links">
            ${(ctx.navLinks ?? []).map(link => html`
              <li>
                <a href="${link.href}" class="ft-link-mono">${link.label}</a>
              </li>
            `)}
          </ul>
          <p class="ft-copyright">© ${ctx.year} · ${ctx.brandName} DS · ${ctx.location}</p>
        </div>

      </div>
    </footer>
  `;
}

/* ────────────────────────────────────────────────────────────
   02 · ACCORDION MOBILE (dark)
   ──────────────────────────────────────────────────────────── */
export function renderAccordion(ctx: LibFooter): TemplateResult {
  return html`
    <footer>
      <div class="ft-inner" style="max-width:480px;">

        <!-- Brand + social row -->
        <div class="ft-acc-brand-row">
          <div class="ft-brand-dark">
            ${ctx.brandName} <em>${ctx.brandKanji}</em>
          </div>
          <div class="ft-social-mini">
            <a href="${ctx.githubHref}" class="ft-social-mini-btn" aria-label="GitHub">
              ${ICON_GITHUB}
            </a>
            <a href="${ctx.linkedinHref}" class="ft-social-mini-btn" aria-label="LinkedIn">
              ${ICON_LINKEDIN}
            </a>
            <a href="mailto:${ctx.email}" class="ft-social-mini-btn" aria-label="Email">
              ${ICON_EMAIL}
            </a>
          </div>
        </div>

        <!-- Accordion columns -->
        ${(ctx.columns ?? []).map(col => html`
          <div class="ft-acc-item">
            <button
              class="ft-acc-trigger"
              @click=${(e: Event):void => ctx._toggleAccordion(e.currentTarget as HTMLElement)}
              aria-expanded="false"
            >
              ${col.heading}
              <span class="ft-acc-arrow">${ICON_CHEVRON_DOWN}</span>
            </button>
            <div class="ft-acc-body">
              <div class="ft-acc-body-inner">
                ${(col.links ?? []).map(link => html`<a href="${link.href}">${link.label}</a>`)}
              </div>
            </div>
          </div>
        `)}

        <!-- Bottom bar -->
        <div class="ft-bottom" style="border-top-color:rgba(255,255,255,.06);">
          <p class="ft-copyright">© ${ctx.year} · ${ctx.brandName} · MIT</p>
          <div style="display:flex;gap:var(--lib-space-md,1rem);">
            ${(ctx.legalLinks ?? []).map(link => html`
              <a href="${link.href}" class="ft-link-mono">${link.label}</a>
            `)}
          </div>
        </div>

      </div>
    </footer>
  `;
}

/* ────────────────────────────────────────────────────────────
   03 · KINTSUGI (dark + gold seam)
   ──────────────────────────────────────────────────────────── */
export function renderKintsugi(ctx: LibFooter): TemplateResult {
  return html`
    <footer style="position:relative;">

      <!-- Gold seam -->
      <div class="ft-kintsugi-seam" aria-hidden="true"></div>

      <!-- Ring ornament -->
      <div class="ft-kintsugi-ring" aria-hidden="true">
        <div class="ft-kintsugi-ring-track"></div>
        <span class="ft-kintsugi-symbol">✦</span>
      </div>

      <div class="ft-inner" style="padding-top:var(--lib-space-xl,2rem);">

        <!-- Brand centered -->
        <div style="text-align:center;margin-bottom:var(--lib-space-lg,1.5rem);">
          <div class="ft-brand-dark" style="font-size:1.75rem;">
            ${ctx.brandName} <em>${ctx.brandKanji}</em>
          </div>
          <span style="font-family:var(--lib-font-mono,'DM Mono',monospace);font-size:.5rem;letter-spacing:.22em;text-transform:uppercase;color:rgba(250,247,244,.18);display:block;margin-top:.375rem;">
            ${ctx.brandSub}
          </span>
        </div>

        <!-- Nav columns -->
        <div class="ft-kintsugi-grid">
          ${(ctx.columns ?? []).map(col => html`
            <div>
              <div class="ft-kintsugi-col-head">${col.heading}</div>
              <ul class="ft-kintsugi-col-links">
                ${(col.links ?? []).map(link => html`
                  <li>
                    <a href="${link.href}">
                      <span class="ft-kintsugi-arrow">›</span>
                      ${link.label}
                    </a>
                  </li>
                `)}
              </ul>
            </div>
          `)}
        </div>

        <!-- Bottom bar -->
        <div class="ft-bottom" style="border-top-color:rgba(255,255,255,.06);">
          <p class="ft-copyright">// © ${ctx.year} · ${ctx.brandName.toUpperCase()} · MIT LICENSE</p>
          <div style="display:flex;gap:var(--lib-space-md,1rem);">
            ${(ctx.legalLinks ?? []).map(link => html`
              <a href="${link.href}" class="ft-link-mono">${link.label}</a>
            `)}
          </div>
        </div>

      </div>
    </footer>
  `;
}

/* ────────────────────────────────────────────────────────────
   04 · GLITCH TERMINAL (dark + scanlines + noise)
   ──────────────────────────────────────────────────────────── */
export function renderGlitch(ctx: LibFooter): TemplateResult {
  return html`
    <footer style="position:relative;overflow:hidden;">

      <!-- Texture layers -->
      <div class="ft-glitch-scanlines" aria-hidden="true"></div>
      <div class="ft-glitch-noise" aria-hidden="true"></div>

      <div class="ft-inner">

        <div class="ft-glitch-grid">

          <!-- Col 1: brand + status -->
          <div>
            <!-- Status indicators -->
            <div style="margin-bottom:var(--lib-space-md,1rem);">
              <div class="ft-status-row">
                <span class="ft-status-dot online"></span>
                <span class="ft-status-text">System · online</span>
              </div>
              <div class="ft-status-row">
                <span class="ft-status-dot pending"></span>
                <span class="ft-status-text">Build · pending deploy</span>
              </div>
            </div>

            <h2 class="ft-glitch-head">
              ${ctx.brandName}<br>
              <em>${ctx.brandKanji}</em><span class="ft-glitch-cursor"></span>
            </h2>

            <p class="ft-glitch-sub">
              Design System · ${ctx.location}<br>
              v${ctx.version} · ${ctx.year}
            </p>
          </div>

          <!-- Col 2: modules -->
          <div>
            <div class="ft-glitch-modules-head">// modules</div>
            <div class="ft-glitch-modules-links">
              ${(ctx.navLinks ?? []).map(link => html`
                <a href="${link.href}">
                  <span style="color:var(--color-kaki-400,#D97234);opacity:.6;">${ICON_ARROW_SM}</span>
                  ${link.label}
                </a>
              `)}
            </div>
          </div>

          <!-- Col 3: runtime -->
          <div>
            <div class="ft-glitch-modules-head">// runtime</div>
            <div class="ft-glitch-runtime">
              ${(ctx.runtimeLines ?? []).map(line => html`
                <div>
                  <span class="key">${line.key.padEnd(5, '\u00A0')}</span>
                  ${line.value.includes('0') && line.key === 'deps'
                    ? html`<span class="celadon">${line.value}</span>`
                    : line.value
                  }
                </div>
              `)}
            </div>
          </div>

        </div>

        <!-- Bottom mono bar -->
        <div class="ft-bottom" style="border-top-color:rgba(255,255,255,.06);">
          <p class="ft-copyright">// © ${ctx.year} · ${ctx.brandName.toUpperCase()} · MIT LICENSE · node ${ctx.nodeVersion}</p>
          <div style="display:flex;gap:var(--lib-space-md,1rem);">
            ${(ctx.legalLinks ?? []).map(link => html`
              <a href="${link.href}" class="ft-link-mono">${link.label}</a>
            `)}
          </div>
        </div>

      </div>
    </footer>
  `;
}

/* ────────────────────────────────────────────────────────────
   Dispatcher — decide qué template renderizar
   ──────────────────────────────────────────────────────────── */
export function renderFooter(ctx: LibFooter): TemplateResult {
  switch (ctx.variant) {
    case 'social':    return renderSocial(ctx);
    case 'accordion': return renderAccordion(ctx);
    case 'kintsugi':  return renderKintsugi(ctx);
    case 'glitch':    return renderGlitch(ctx);
    default:          return renderSocial(ctx);
  }
}