import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, input } from '@angular/core';
import { WorkExperienceDto } from '../about.models';

function formatDate(ym: string): string {
  const [year, month] = ym.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
}

function formatDuration(startDate: string, endDate: string | null): string {
  const start = new Date(startDate.replace('-', '/') + '/01');
  const end = endDate ? new Date(endDate.replace('-', '/') + '/01') : new Date();
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  const years = Math.floor(months / 12);
  const rem = months % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} año${years > 1 ? 's' : ''}`);
  if (rem > 0) parts.push(`${rem} mes${rem > 1 ? 'es' : ''}`);
  return parts.join(' ');
}

@Component({
  selector: 'app-experience-section',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './experience-section.html',
  styleUrl: './experience-section.scss',
})
export class ExperienceSectionComponent {
  experience = input.required<WorkExperienceDto[]>();
  sorted = computed(() => [...this.experience()].sort((a, b) => a.order - b.order));

  formatDate = formatDate;
  formatDuration = formatDuration;
}
