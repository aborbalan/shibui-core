import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

interface InstallStep {
  step: string;
  code: string;
  language: string;
  filename: string;
}

/** Home · "De npm a componente en tres pasos" — quickstart con lib-code-block. */
@Component({
  selector: 'app-install-section',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section class="install">
      <div class="install__head">
        <lib-eyebrow surface="default" size="sm">INICIO RÁPIDO</lib-eyebrow>
        <h2 class="install__title">
          De npm a componente <em>en tres pasos</em>
        </h2>
      </div>

      <div class="install__steps">
        @for (s of steps; track s.step) {
          <div class="install__row">
            <span class="install__num">{{ s.step }}</span>
            <lib-code-block
              [attr.code]="s.code"
              [attr.language]="s.language"
              [attr.filename]="s.filename"
              copyable
              variant="solid"
            ></lib-code-block>
          </div>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .install {
        max-width: 720px;
        margin: 0 auto;
        padding: var(--lib-space-3xl, 4rem) var(--lib-space-xl, 2rem);
        display: flex;
        flex-direction: column;
        gap: var(--lib-space-2xl, 3rem);
      }
      .install__head {
        display: flex;
        flex-direction: column;
        gap: var(--lib-space-sm, 0.5rem);
      }
      .install__title {
        margin: 0;
        font-family: var(--lib-font-display, 'Cormorant Garamond', serif);
        font-size: var(--text-2xl, 2rem);
        font-weight: 300;
        letter-spacing: -0.02em;
        line-height: 1.2;
        color: var(--text-primary);
      }
      .install__title em {
        font-style: normal;
        color: var(--text-accent);
      }
      .install__steps {
        display: flex;
        flex-direction: column;
        gap: var(--lib-space-md, 1rem);
      }
      .install__row {
        display: grid;
        grid-template-columns: 2.5rem 1fr;
        gap: var(--lib-space-md, 1rem);
        align-items: start;
      }
      .install__num {
        font-family: var(--lib-font-mono, 'DM Mono', monospace);
        font-size: 0.625rem;
        letter-spacing: 0.12em;
        color: var(--text-muted, var(--text-secondary));
        padding-top: var(--lib-space-md, 1rem);
        text-align: right;
      }
    `,
  ],
})
export class InstallSectionComponent {
  readonly steps: InstallStep[] = [
    { step: '01', code: 'pnpm add @shibui-ui/ui', language: 'bash', filename: '' },
    { step: '02', code: "import '@shibui-ui/ui';", language: 'ts', filename: 'main.ts' },
    { step: '03', code: '<lib-button variant="accent">Empezar</lib-button>', language: 'html', filename: '' },
  ];
}
