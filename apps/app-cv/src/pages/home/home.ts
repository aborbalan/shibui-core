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
        <cv-projects [items]="projects" />

        <lib-divider class="no-print"></lib-divider>
        <div class="no-print">
          <cv-katachi-band [value]="katachi()" (valueChange)="setKatachi($event)" />
          <cv-token-specimen [katachi]="katachi()" />
        </div>

        <lib-divider></lib-divider>
        <cv-experience [items]="experience" />

        <lib-divider></lib-divider>
        <cv-skills [groups]="skills" [fullStack]="fullStack" />

        <lib-divider></lib-divider>
        <cv-colophon [education]="education" [languages]="languages" [profile]="profile" />
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
      .page {
        max-width: 760px;
        margin-inline: auto;
        padding-inline: var(--lib-space-lg, 24px);
        padding-bottom: var(--lib-space-xl, 32px);
      }
      lib-divider {
        display: block;
        margin-block: var(--lib-space-xl, 32px);
      }
      .page > cv-projects,
      .page > cv-experience,
      .page > cv-skills,
      .page > cv-colophon {
        display: block;
        scroll-margin-top: var(--lib-space-xl, 32px);
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
