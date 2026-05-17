import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-filosofia',
  standalone: true,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './filosofia.html',
  styleUrl: './filosofia.scss',
})
export class FilosofiaComponent {
  pillars = [
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

  principles = [
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
