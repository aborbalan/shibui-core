import { Component, computed, input } from '@angular/core';

interface StatItem {
  value: number;
  suffix?: string;
  prefix?: string;
  text?: string;
  label: string;
}

@Component({
  selector: 'app-hero-stats',
  imports: [],
  templateUrl: './hero-stats.html',
  styleUrl: './hero-stats.scss',
})
export class HeroStatsComponent {
  // Signal Inputs
  stats = input<StatItem[]>([
    { value: 66, suffix: '+', label: 'Componentes' },
    { value: 0, label: 'Dependencias' },
    { value: 4, suffix: '×', label: 'Variantes cada uno' },
    { text: 'MIT', label: 'Licencia', value: 0 },
  ]);

  // Estilos base que pueden ser extendidos
  customStyle = input<Partial<CSSStyleDeclaration>>({});

  // Mezcla de estilos reactiva
  containerStyles = computed(() => ({
    display: 'flex',
    alignItems: 'stretch',
    gap: '0',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    paddingTop: '2.5rem',
    opacity: '0',
    animation: 'fadeUp 0.9s 0.6s cubic-bezier(0,0,0.2,1) forwards',
    flexWrap: 'wrap',
    height: '70px',
    ...this.customStyle(),
  }));
}
