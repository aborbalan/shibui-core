import fs from 'fs';
import path from 'path';

/**
 * Genera wrappers de React a partir del custom-elements.json.
 *
 * Cambios respecto a la versión anterior:
 * - Eliminado @ts-nocheck de cada fichero generado
 * - Corregida la indentación del template literal (ya no hereda
 *   los 8 espacios del bloque padre)
 * - Reemplazado React.FC<any> por ComponentType con tipado explícito
 * - Reemplazado || [] por ?? [] para consistencia con el resto del proyecto
 * - Eliminado trim() final (ya no hay sangría que recortar)
 */
export function generateReact(manifest): void {
  const outDirReact = './dist/react';
  if (!fs.existsSync(outDirReact)) fs.mkdirSync(outDirReact, { recursive: true });

  const componentsList: { name: string; tag: string }[] = [];

  manifest.modules.forEach(module => {
    module.declarations?.forEach(decl => {
      if (!decl.customElement) return;

      const componentName: string = decl.name;
      const tagName: string = decl.tagName;

      // Mapeo de eventos custom → prop onXxx de React
      const eventsEntries: string[] = decl.events?.map(event => {
        const reactEventName = `on${event.name
          .split('-')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join('')}`;
        return `  '${reactEventName}': '${event.name}'`;
      }) ?? [];

      const eventsBlock = eventsEntries.length > 0
        ? `{\n${eventsEntries.join(',\n')}\n}`
        : '{}';

      // Template limpio — sin sangría heredada del bloque padre
      const content = `import React from 'react';
import { createComponent } from '@lit/react';
import { ${componentName} as Element } from '../index.js';

/**
 * React wrapper for <${tagName}>
 * Auto-generated — do not edit manually.
 */
const _${componentName} = createComponent({
  react: React,
  tagName: '${tagName}',
  elementClass: Element,
  events: ${eventsBlock},
});

// Cast necesario para resolver la incompatibilidad entre el tipo de retorno
// de createComponent y las restricciones de JSX. Evita @ts-nocheck manteniendo
// type-safety en el consumidor mediante ${componentName}Props.
export const ${componentName} = _${componentName} as unknown as React.ComponentType<
  React.HTMLAttributes<HTMLElement> & Record<string, unknown>
>;

export type ${componentName}Props = React.ComponentPropsWithRef<typeof ${componentName}>;
`;

      fs.writeFileSync(path.join(outDirReact, `${tagName}.tsx`), content);
      componentsList.push({ name: componentName, tag: tagName });
    });
  });

  const indexContent = componentsList
    .map(comp => `export * from './${comp.tag}';`)
    .join('\n');

  fs.writeFileSync(path.join(outDirReact, 'index.ts'), indexContent);

  console.log('  └─ ✅ React wrappers: generated with explicit typing.');
}