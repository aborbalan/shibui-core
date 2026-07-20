import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Hero } from '@components/hero/hero';
import { Experience } from '@components/experience/experience';
import { Projects } from '@components/projects/projects';
import { Skills } from '@components/skills/skills';
import { Colophon } from '@components/colophon/colophon';
import { profile, experience, projects, skills, fullStack, education, languages } from '@data/cv';

/**
 * Página única del CV. Smart component: inyecta los datos estáticos
 * y los reparte a las secciones (dumb) por inputs.
 */
@Component({
  selector: 'cv-home',
  standalone: true,
  imports: [Hero, Experience, Projects, Skills, Colophon],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <lib-background theme="kaki-glow" class="bg">
      <main class="page">
        <cv-hero [profile]="profile" />

        <lib-divider></lib-divider>
        <cv-projects [items]="projects" />

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
}
