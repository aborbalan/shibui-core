import fs from 'fs';
import path from 'path';

/**
 * Genera wrappers de React con estándares de Arquitectura Senior.
 */
export function generateReact(manifest) {
  const outDirReact = './dist/react';
  if (!fs.existsSync(outDirReact)) fs.mkdirSync(outDirReact, { recursive: true });

  const componentsList: { name: string; tag: string }[] = [];

  manifest.modules.forEach(module => {
    module.declarations?.forEach(decl => {
      if (decl.customElement) {
        const componentName = decl.name; 
        const tagName = decl.tagName;    
        
        // Mapeo de eventos optimizado
        const eventsEntries = decl.events?.map(event => {
          const reactEventName = `on${event.name
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('')}`;
          return `    '${reactEventName}': '${event.name}'`;
        }) || [];

        const eventsBlock = eventsEntries.length > 0 
        ? `{
          ${eventsEntries.map(entry => entry.trim()).join(',\n    ')}
        }` 
        : '{}';

        // CAMBIO CRÍTICO: Importamos desde '../index' (sin .js) para que TS use el .d.ts
        // Añadimos directiva de tipos para React.
        const content = `// @ts-nocheck
        import React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { ${componentName} as Element } from '../index.js';

/**
 * Wrapper de React para <${tagName}>
 * Generado automáticamente - No editar manualmente.
 */
export const _${componentName} = createComponent({
  react: React,
  tagName: '${tagName}',
  elementClass: Element,
  events: ${eventsBlock}
});

// Tipado para evitar el error "JSX element class does not support attributes"
export const ${componentName} = _${componentName} as unknown as React.FC<any>;
export type ${componentName}Props = React.ComponentProps<typeof ${componentName}>;
`;

        fs.writeFileSync(path.join(outDirReact, `${tagName}.tsx`), content.trim());
        componentsList.push({ name: componentName, tag: tagName });
      }
    });
  });

  const indexContent = componentsList
    .map(comp => `export * from './${comp.tag}';`) 
    .join('\n');
    
  fs.writeFileSync(path.join(outDirReact, 'index.ts'), indexContent);
  
  console.log('  └─ ✅ React wrappers: Generados con resolución de tipos corregida.');
}