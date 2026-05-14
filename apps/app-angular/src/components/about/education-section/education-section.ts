import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, input } from '@angular/core';
import { EducationDto, LanguageDto } from '../about.models';

type BadgeVariant = 'default' | 'accent' | 'celadon' | 'dark';

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

  readonly LEVEL_VARIANT: Record<string, BadgeVariant> = {
    Nativo: 'accent',
    Profesional: 'celadon',
    Intermedio: 'default',
    Básico: 'dark',
  };

  getLevelVariant(level: string): BadgeVariant {
    return this.LEVEL_VARIANT[level] ?? 'dark';
  }
}
