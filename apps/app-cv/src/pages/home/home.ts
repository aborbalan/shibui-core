import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Hero } from '@components/hero/hero';
import { Experience } from '@components/experience/experience';
import { Projects } from '@components/projects/projects';
import { Skills } from '@components/skills/skills';
import { Education } from '@components/education/education';
import { Languages } from '@components/languages/languages';
import { profile, experience, projects, skills, education, languages } from '@data/cv';

/**
 * Página única del CV. Smart component: inyecta los datos estáticos
 * y los reparte a las secciones (dumb) por inputs.
 */
@Component({
  selector: 'cv-home',
  standalone: true,
  imports: [Hero, Experience, Projects, Skills, Education, Languages],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <lib-background variant="kaki-glow" class="bg">
      <main class="page">
        <cv-hero [profile]="profile" />

        <lib-divider></lib-divider>
        <cv-experience [items]="experience" />

        <lib-divider></lib-divider>
        <cv-projects [items]="projects" />

        <lib-divider></lib-divider>
        <cv-skills [groups]="skills" />

        <lib-divider></lib-divider>
        <cv-education [items]="education" />

        <lib-divider></lib-divider>
        <cv-languages [items]="languages" />

        <footer class="page__foot">
          <span>© {{ year }} {{ profile.firstName }} {{ profile.lastName }}</span>
          <span>{{ profile.location }}</span>
        </footer>
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
      .page > cv-experience,
      .page > cv-projects,
      .page > cv-skills,
      .page > cv-education,
      .page > cv-languages {
        display: block;
        scroll-margin-top: var(--lib-space-xl, 32px);
      }
      .page__foot {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: var(--lib-space-sm, 8px);
        margin-top: var(--lib-space-xl, 32px);
        padding-top: var(--lib-space-lg, 24px);
        font-family: var(--lib-font-mono, monospace);
        font-size: var(--text-xs, 0.6875rem);
        letter-spacing: var(--tracking-wide, 0.08em);
        color: var(--text-muted);
      }
    `,
  ],
})
export class HomePage {
  protected readonly profile = profile;
  protected readonly experience = experience;
  protected readonly projects = projects;
  protected readonly skills = skills;
  protected readonly education = education;
  protected readonly languages = languages;
  protected readonly year = new Date().getFullYear();
}
