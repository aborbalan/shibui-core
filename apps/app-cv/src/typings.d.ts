// src/typings.d.ts

// Cualquier ruta que termine en ?raw es un módulo válido que devuelve un string
declare module '*?raw' {
  const content: string;
  export default content;
}

// SVGs normales sin ?raw
declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*?inline' {
  const content: string;
  export default content;
}
