import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, input } from '@angular/core';
import { EducationDto, LanguageDto } from '../about.models';

type BadgeTone = 'default' | 'accent' | 'info' | 'strong';

@Component({
  selector: 'app-education-section',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './education-section.html',
  styleUrl: './education-section.scss',
})
export class EducationSectionComponent {
  education = input.required<EducationDto[]>();
  languages = input.required<LanguageDto[]>();

  sortedEdu = computed(() => [...this.education()].sort((a, b) => a.order - b.order));
  sortedLang = computed(() => [...this.languages()].sort((a, b) => a.order - b.order));

  readonly LEVEL_TONE: Record<string, BadgeTone> = {
    Nativo: 'accent',
    Profesional: 'info',
    Intermedio: 'default',
    Básico: 'strong',
  };

  getLevelTone(level: string): BadgeTone {
    return this.LEVEL_TONE[level] ?? 'strong';
  }
}
