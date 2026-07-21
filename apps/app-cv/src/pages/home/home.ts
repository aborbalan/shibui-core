import { Component, CUSTOM_ELEMENTS_SCHEMA, computed } from '@angular/core';
import { Hero } from '@components/hero/hero';
import { Experience } from '@components/experience/experience';
import { Projects } from '@components/projects/projects';
import { Skills } from '@components/skills/skills';
import { Colophon } from '@components/colophon/colophon';
import { KatachiBand } from '@components/katachi-band/katachi-band';
import { TokenSpecimen } from '@components/token-specimen/token-specimen';
import { profile, experience, projects, skills, fullStack, education, languages } from '@data/cv';
import { KATACHI_BG } from '@data/katachi';
import { katachi, setKatachi } from '../../state/katachi.store';

/**
 * Página única del CV. Smart component: inyecta los datos estáticos
 * y los reparte a las secciones (dumb) por inputs.
 */
@Component({
  selector: 'cv-home',
  standalone: true,
  imports: [Hero, Experience, Projects, Skills, Colophon, KatachiBand, TokenSpecimen],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <!-- Superficie art-directed afín al katachi activo (los temas de
         lib-background no reaccionan solos al katachi). -->
    <lib-background [attr.theme]="bgTheme()" class="bg">
      <main class="page">
        <cv-hero [profile]="profile" />

        <lib-divider></lib-divider>
        <lib-stagger-container class="wide" direction="up">
          <cv-projects [items]="projects" />
        </lib-stagger-container>

        <lib-divider class="no-print"></lib-divider>
        <lib-stagger-container class="wide no-print" direction="up">
          <cv-katachi-band [value]="katachi()" (valueChange)="setKatachi($event)" />
          <cv-token-specimen [katachi]="katachi()" />
        </lib-stagger-container>

        <lib-divider></lib-divider>
        <lib-stagger-container direction="up">
          <cv-experience [items]="experience" />
        </lib-stagger-container>

        <lib-divider></lib-divider>
        <lib-stagger-container direction="up">
          <cv-skills [groups]="skills" [fullStack]="fullStack" />
        </lib-stagger-container>

        <lib-divider></lib-divider>
        <lib-stagger-container direction="up">
          <cv-colophon [education]="education" [languages]="languages" [profile]="profile" />
        </lib-stagger-container>
      </main>
    </lib-background>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .bg {
        display: block;
        min-height: 100svh;
      }
      /* Retícula editorial: columna de lectura centrada (~68ch) con dos
         canales laterales. Por defecto todo va a la columna de lectura;
         las secciones .wide sangran a todo el ancho (full) para romper la
         monotonía de la columna única. */
      .page {
        max-width: 1140px;
        margin-inline: auto;
        padding-inline: var(--lib-space-lg, 24px);
        padding-bottom: var(--lib-space-xl, 32px);
        display: grid;
        grid-template-columns:
          [full-start] minmax(0, 1fr)
          [content-start] minmax(0, 68ch) [content-end]
          minmax(0, 1fr) [full-end];
      }
      .page > * {
        grid-column: content;
        min-width: 0;
      }
      .page > .wide {
        grid-column: full;
      }
      lib-divider {
        display: block;
        margin-block: var(--lib-space-xl, 32px);
      }
      /* En papel: una sola columna, sin la retícula de pantalla. */
      @media print {
        .page {
          display: block;
          max-width: 100%;
        }
      }
    `,
  ],
})
export class HomePage {
  protected readonly profile = profile;
  protected readonly experience = experience;
  protected readonly projects = projects;
  protected readonly skills = skills;
  protected readonly fullStack = fullStack;
  protected readonly education = education;
  protected readonly languages = languages;

  protected readonly katachi = katachi;
  protected readonly setKatachi = setKatachi;
  protected readonly bgTheme = computed(() => KATACHI_BG[katachi()]);
}
