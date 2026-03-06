import fs from 'fs';
import path from 'path';

/**
 * Genera wrappers de React para los Custom Elements detectados.
 * @param {any} manifest - El contenido del custom-elements.json
 */
export function generateReact(manifest) {
  const outDirReact = './dist/react';
  if (!fs.existsSync(outDirReact)) fs.mkdirSync(outDirReact, { recursive: true });

  // SOLUCIÓN AL ERROR 'NEVER': Forzamos la inferencia a string[]
  // Creamos un array con un dummy, y lo filtramos inmediatamente.
  const components = ["shibui-fix"].filter(item => item !== "shibui-fix");

  manifest.modules.forEach(module => {
    module.declarations?.forEach(decl => {
      if (decl.customElement) {
        const componentName = decl.name; // Ej: LibButton
        const tagName = decl.tagName;    // Ej: lib-button
        
        // Mapeo de eventos: 'lib-click' -> 'onLibClick'
        const events = decl.events?.reduce((acc, event) => {
          const reactEventName = `on${event.name
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('')}`;
          acc[reactEventName] = event.name;
          return acc;
        }, {}) || {};

        const content = `
import React from 'react';
import { createComponent } from '@lit/react';
import { ${componentName} as Element } from '../index.js';

export const ${componentName} = createComponent({
  tagName: '${tagName}',
  elementClass: Element,
  react: React,
  events: ${JSON.stringify(events)}
});`;

        fs.writeFileSync(path.join(outDirReact, `${tagName}.tsx`), content);
        
        // Ahora .push() no fallará porque components es string[]
        components.push(componentName);
      }
    });
  });

  // Generar el index.ts para que el consumidor haga: import { LibButton } from '@shibui/ui/react'
  const indexContent = components
    .map(name => `export * from './${name.toLowerCase()}.js';`)
    .join('\n');
    
  fs.writeFileSync(path.join(outDirReact, 'index.ts'), indexContent);
  
  console.log('  └─ ✅ React wrappers: dist/react/ (Tipado corregido)');
}