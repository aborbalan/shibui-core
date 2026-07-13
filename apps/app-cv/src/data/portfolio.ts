/**
 * Portfolio + CV de Sandra Ortega Arévalo — escultora.
 * Fuente única de verdad, 100% estática (mismo principio que `cv.ts`).
 *
 * Contenido real:
 *  - Obras: extraídas del portfolio «Portafolio_Sandra_Ortega» (11 piezas con
 *    título, material y dimensiones). Las fotos viven en `public/portfolio/`.
 *  - CV: extraído del «Curriculum_sandra».
 *
 * Nota de privacidad: el teléfono y la fecha de nacimiento del CV NO se
 * publican aquí a propósito (evitar spam/scrapers). Solo el email, que la
 * artista ya usa públicamente.
 */

export interface ArtistProfile {
  firstName: string;
  lastName: string;
  /** Kicker sobre el nombre */
  title: string;
  /** Tagline de una línea */
  tagline: string;
  /** Declaración de artista — párrafo breve */
  statement: string;
  /** Foto de la artista (fichero en public/portfolio/) */
  photo: string;
  /** Ubicación — footer */
  location: string;
  email: string;
  instagram?: string;
}

export interface Artwork {
  /** Identificador y prefijo de los ficheros de foto */
  slug: string;
  title: string;
  /** Material / técnica */
  material: string;
  /** Dimensiones (cm salvo indicación) — opcional */
  dimensions?: string;
  /** Ficheros en public/portfolio/ (la primera es la portada) */
  photos: string[];
}

export interface CvEntry {
  role: string;
  place: string;
  period: string;
  /** Relevante para la faceta escultórica → se destaca */
  highlight?: boolean;
}

export interface LanguageItem {
  name: string;
  level: string;
}

// ─────────────────────────────────────────────────────────────
// ARTISTA
// ─────────────────────────────────────────────────────────────
export const artist: ArtistProfile = {
  firstName: 'Sandra',
  lastName: 'Ortega Arévalo',
  title: 'Escultora',
  tagline:
    'Escultura en piedra, madera y gran formato — de la talla clásica a las piezas de espectáculo.',
  statement:
    'Formada en la Escuela de Artes de Zaragoza (Escultura Aplicada al Espectáculo y ' +
    'Técnicas Escultóricas). Trabajo la talla directa en piedra y madera y la ' +
    'construcción de piezas de gran formato en poliestireno, resina y fibra. Me ' +
    'interesa llevar objetos cotidianos —un pan, un chuletón, un croissant— a una ' +
    'escala que obliga a mirarlos de otra manera.',
  photo: 'sandra-retrato.jpg',
  location: 'Pontevedra, España',
  email: 'sandraortega2402@gmail.com',
  // instagram: 'https://instagram.com/...', // TODO (opcional) si quiere enlazarlo
};

// ─────────────────────────────────────────────────────────────
// OBRA — orden del portfolio original.
// ─────────────────────────────────────────────────────────────
export const artworks: Artwork[] = [
  {
    slug: 'fundicion',
    title: 'Fundición',
    material: 'Pieza maciza de cobre sobre base de alabastro',
    photos: ['fundicion-1.jpg', 'fundicion-2.jpg', 'fundicion-3.jpg'],
  },
  {
    slug: 'pan-de-oro',
    title: 'Pan de oro',
    material: 'Resina acrílica',
    photos: ['pan-de-oro-1.jpg', 'pan-de-oro-2.jpg', 'pan-de-oro-3.jpg', 'pan-de-oro-4.jpg'],
  },
  {
    slug: 'curvas-infinitas',
    title: 'Curvas infinitas',
    material: 'Piedra de Puebla de Albortón',
    dimensions: '40 × 25 × 15 cm',
    photos: ['curvas-infinitas-1.jpg', 'curvas-infinitas-2.jpg', 'curvas-infinitas-3.jpg'],
  },
  {
    slug: 'relieve-elefante',
    title: 'Relieve de elefante y espirales',
    material: 'Piedra de arenisca',
    dimensions: '40 × 25 cm',
    photos: ['relieve-elefante-1.jpg', 'relieve-elefante-2.jpg'],
  },
  {
    slug: 'torso-desnudo',
    title: 'Torso desnudo',
    material: 'Piedra de alabastro',
    dimensions: '40 × 20 cm',
    photos: ['torso-desnudo-1.jpg', 'torso-desnudo-2.jpg', 'torso-desnudo-3.jpg'],
  },
  {
    slug: 'mano-de-gigante',
    title: 'Mano de gigante',
    material: 'Poliestireno recubierto con resina acrílica y fibra de vidrio',
    dimensions: '1,40 × 1,20 m',
    photos: ['mano-de-gigante-1.jpg'],
  },
  {
    slug: 'colaboracion-apila',
    title: 'Colaboración con la editorial de Apila',
    material: 'Poliestireno recubierto con resina acrílica y fibra de vidrio',
    dimensions: '1,40 × 1,70 m',
    photos: ['colaboracion-apila-1.jpg'],
  },
  {
    slug: 'chuleton-gigante',
    title: 'Chuletón gigante',
    material: 'Poliestireno recubierto con fibra de caucho',
    dimensions: '1,20 × 0,70 m',
    photos: ['chuleton-gigante-1.jpg', 'chuleton-gigante-2.jpg', 'chuleton-gigante-3.jpg'],
  },
  {
    slug: 'croissant-gigante',
    title: 'Croissant gigante',
    material: 'Poliestireno recubierto con fibra de caucho',
    dimensions: '80 × 40 cm',
    photos: ['croissant-gigante-1.jpg', 'croissant-gigante-2.jpg'],
  },
  {
    slug: 'gota',
    title: 'Gota',
    material: 'Madera',
    dimensions: '50 × 40 cm',
    photos: ['gota-1.jpg', 'gota-2.jpg', 'gota-3.jpg'],
  },
  {
    slug: 'lobo',
    title: 'Lobo',
    material: 'Madera de pino',
    dimensions: '80 × 25 cm',
    photos: ['lobo-1.jpg', 'lobo-2.jpg', 'lobo-3.jpg'],
  },
];

// ─────────────────────────────────────────────────────────────
// FORMACIÓN — orden cronológico inverso.
// ─────────────────────────────────────────────────────────────
export const education: CvEntry[] = [
  {
    role: 'Grado Superior en Técnicas Escultóricas',
    place: 'Escuela de Artes de Zaragoza',
    period: '2022 – 2024',
    highlight: true,
  },
  {
    role: 'Grado Superior en Escultura Aplicada al Espectáculo',
    place: 'Escuela de Artes de Zaragoza',
    period: '2020 – 2022',
    highlight: true,
  },
  {
    role: 'Bachillerato de Artes',
    place: 'IES Andalán, Zaragoza',
    period: '2018 – 2020',
  },
];

// ─────────────────────────────────────────────────────────────
// EXPERIENCIA EN ESCULTURA — orden cronológico inverso.
// ─────────────────────────────────────────────────────────────
export const sculptureExperience: CvEntry[] = [
  {
    role: 'Tallista — «Pasión por la Escultura»',
    place: 'Anglada',
    period: 'sep 2024 – abr 2025',
    highlight: true,
  },
  {
    role: 'Prácticas de escultura',
    place: 'Anglada',
    period: 'may 2024',
    highlight: true,
  },
];

// ─────────────────────────────────────────────────────────────
// OTRA EXPERIENCIA — fuera de la escultura, orden cronológico inverso.
// ─────────────────────────────────────────────────────────────
export const otherExperience: CvEntry[] = [
  {
    role: 'Agente comercial (seguros)',
    place: 'Santa Lucía',
    period: 'jun 2025 – actualidad',
  },
  {
    role: 'Venta solidaria de boletos',
    place: 'Cruz Roja',
    period: 'may – jun 2025',
  },
  {
    role: 'Dependienta',
    place: 'Pastelería Tolosana',
    period: 'nov 2023 – ago 2024',
  },
  {
    role: 'Dependienta de panadería',
    place: 'Eroski',
    period: 'feb – may',
  },
  {
    role: 'Dependienta de panadería',
    place: 'Panadería',
    period: 'jul 2019 – nov 2023',
  },
];

// ─────────────────────────────────────────────────────────────
// SOFTWARE — herramientas de modelado y diseño (nivel básico salvo Office).
// ─────────────────────────────────────────────────────────────
export const software: string[] = ['ZBrush', 'Rhinoceros', 'Adobe InDesign', 'Microsoft Office'];

// ─────────────────────────────────────────────────────────────
// IDIOMAS
// ─────────────────────────────────────────────────────────────
export const languages: LanguageItem[] = [
  { name: 'Castellano', level: 'Nativo' },
  { name: 'Inglés', level: 'Medio' },
  { name: 'Francés', level: 'Básico' },
];

// ─────────────────────────────────────────────────────────────
// OTROS — datos varios (permiso de conducir, etc.)
// ─────────────────────────────────────────────────────────────
export const extras: string[] = ['Carnet de conducir'];
