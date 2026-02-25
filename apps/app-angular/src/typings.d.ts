// src/typings.d.ts

// Esto le dice a TypeScript que cualquier ruta que termine en ?raw 
// es un módulo válido que devuelve un string
declare module '*?raw' {
    const content: string;
    export default content;
  }
  
  // Opcional: Si también usas SVGs normales sin ?raw
  declare module '*.svg' {
    const content: any;
    export default content;
  }


  declare module '*?inline' {
    const content: string;
    export default content;
  }