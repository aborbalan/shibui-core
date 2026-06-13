import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { SkillGroupDto } from '../about.models';

type BadgeTone = 'default' | 'accent' | 'info' | 'strong' | 'warning';

@Component({
  selector: 'app-skills-section',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './skills-section.html',
  styleUrl: './skills-section.scss',
})
export class SkillsSectionComponent {
  skillGroups = input.required<SkillGroupDto[]>();

  readonly CATEGORY_TONE: Record<string, BadgeTone> = {
    frontend: 'accent',
    expanding: 'warning',
    backend: 'info',
    architecture: 'default',
    testing: 'strong',
  };

  readonly CATEGORY_KANJI: Record<string, string> = {
    frontend: '前',
    expanding: '拡',
    backend: '後',
    architecture: '構',
    testing: '試',
  };

  getTone(category: string): BadgeTone {
    return this.CATEGORY_TONE[category] ?? 'strong';
  }

  getKanji(category: string): string {
    return this.CATEGORY_KANJI[category] ?? '技';
  }

  sortedSkills(group: SkillGroupDto) {
    return [...group.skills].sort((a, b) => a.order - b.order);
  }
}
