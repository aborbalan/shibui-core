import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';

interface StatItem {
  value: number;
  suffix?: string;
  prefix?: string;
  /** Texto decorativo no numérico — ej: 'MIT'. Si se pasa, omite lib-counter. */
  text?: string;
  label: string;
}

/** Home · fila de métricas del sistema (componentes, dependencias, variantes, licencia). */
@Component({
  selector: 'app-hero-stats',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './hero-stats.html',
  styleUrl: './hero-stats.scss',
})
export class HeroStatsComponent {
  stats = input<StatItem[]>([
    { value: 66, suffix: '+', label: 'Componentes' },
    { value: 0, label: 'Dependencias' },
    { value: 4, suffix: '×', label: 'Variantes cada uno' },
    { text: 'MIT', label: 'Licencia', value: 0 },
  ]);
}
