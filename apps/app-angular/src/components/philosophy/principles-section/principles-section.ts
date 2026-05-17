import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

interface Principle {
  num: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-principles-section',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './principles-section.html',
  styleUrl: './principles-section.scss',
})
export class PrinciplesSectionComponent {
  readonly principles: Principle[] = [
    {
      num: '01',
      title: 'Tokens intencionados',
      description:
        'Cada valor en el sistema — color, espacio, tipografía — existe por una razón semántica. No hay tokens arbitrarios; cada uno codifica una decisión de diseño que puede razonarse.',
    },
    {
      num: '02',
      title: 'Variantes significativas',
      description:
        'Un componente no tiene variantes porque puede tenerlas. Kintsugi, celadon, washi — cada variante encarna un estado emocional o contextual distinto, no una permutación estética.',
    },
    {
      num: '03',
      title: 'Espacio como elemento',
      description:
        'El espaciado no es lo que queda entre cosas. Es un elemento de composición con el mismo peso que el color o la tipografía. Comprimir el espacio es distorsionar el mensaje.',
    },
    {
      num: '04',
      title: 'Transiciones con propósito',
      description:
        'Una animación que no comunica nada es ruido visual. Cada transición en el sistema señala un cambio de estado con duración y curva calibradas — ni más lentas ni más rápidas de lo necesario.',
    },
  ];
}
