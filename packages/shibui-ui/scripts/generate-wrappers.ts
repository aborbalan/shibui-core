import fs from 'fs';
import path from 'path';

import { generateSvelte } from './mappers/generate-svelte-types.ts';
import { generateReact } from './mappers/generate-react.ts';
import { generateAngular } from './mappers/generate-angular.ts';

// 1. Carga la fuente de verdad
const manifestPath = './dist/custom-elements.json';

if (!fs.existsSync(manifestPath)) {
  console.error('❌ Error: No se encuentra custom-elements.json. Ejecuta "npm run analyze" primero.');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

console.log('🚀 Generando wrappers para frameworks...');

// 2. Ejecuta los traductores
try {
  generateSvelte(manifest);
   generateReact(manifest); 
   generateAngular(manifest);
  
  console.log('✨ Proceso finalizado con éxito.');
} catch (error) {
  console.error('💥 Error crítico en la generación:', error);
  process.exit(1);
}