import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { SkillGroupDto } from '../about.models';

type BadgeVariant = 'default' | 'accent' | 'celadon' | 'dark' | 'warning';

@Component({
  selector: 'app-skills-section',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './skills-section.html',
  styleUrl: './skills-section.scss',
})
export class SkillsSectionComponent {
  skillGroups = input.required<SkillGroupDto[]>();

  readonly CATEGORY_VARIANT: Record<string, BadgeVariant> = {
    frontend: 'accent',
    expanding: 'warning',
    backend: 'celadon',
    architecture: 'default',
    testing: 'dark',
  };

  readonly CATEGORY_KANJI: Record<string, string> = {
    frontend: '前',
    expanding: '拡',
    backend: '後',
    architecture: '構',
    testing: '試',
  };

  getVariant(category: string): BadgeVariant {
    return this.CATEGORY_VARIANT[category] ?? 'dark';
  }

  getKanji(category: string): string {
    return this.CATEGORY_KANJI[category] ?? '技';
  }

  sortedSkills(group: SkillGroupDto) {
    return [...group.skills].sort((a, b) => a.order - b.order);
  }
}
