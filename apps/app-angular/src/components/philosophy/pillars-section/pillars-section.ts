import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

interface Pillar {
  kanji: string;
  label: string;
  description: string;
}

@Component({
  selector: 'app-pillars-section',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './pillars-section.html',
  styleUrl: './pillars-section.scss',
})
export class PillarsSectionComponent {
  readonly pillars: Pillar[] = [
    {
      kanji: '侘',
      label: 'Wabi · Imperfección',
      description:
        'La belleza en lo incompleto e impermanente. No se busca la perfección simétrica sino el carácter que emerge de las irregularidades. Los componentes abrazan los estados de transición como parte de la experiencia — el foco, el hover, el loading — no como errores a corregir sino como momentos con dignidad propia.',
    },
    {
      kanji: '金',
      label: 'Kintsugi · Cicatrices de oro',
      description:
        'El arte japonés de reparar la cerámica rota con oro, convirtiendo las fracturas en el rasgo más llamativo de la pieza. En el sistema de diseño, los bordes, las transiciones y los acentos son el oro: la variante kintsugi no oculta sus costuras — las exhibe como ornamento deliberado.',
    },
    {
      kanji: '間',
      label: 'Ma · El espacio',
      description:
        'El intervalo consciente entre notas, entre palabras, entre elementos. El vacío no es ausencia — es presencia activa. Los tokens de espaciado están calibrados para crear respiración visual intencional; comprimir este espacio no es eficiencia, es ruido.',
    },
  ];
}
