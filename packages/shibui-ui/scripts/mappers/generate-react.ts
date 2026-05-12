import fs from 'fs';
import path from 'path';

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

      const content = `import React from 'react';
import { createComponent } from '@lit/react';
import { ${componentName} as Element } from '../index.js';
import type { WebComponentBaseProps } from './types.js';

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
// WebComponentBaseProps omite React.HTMLAttributes intencionadamente — ver types.ts.
export const ${componentName} = _${componentName} as unknown as React.ComponentType<
  WebComponentBaseProps & Record<string, unknown>
>;

export type ${componentName}Props = React.ComponentPropsWithRef<typeof ${componentName}>;
`;

      fs.writeFileSync(path.join(outDirReact, `${tagName}.tsx`), content);
      componentsList.push({ name: componentName, tag: tagName });
    });
  });

  // ── types.ts — tipo base compartido por todos los wrappers ────────────────
  //
  // Por qué NO usamos React.HTMLAttributes<HTMLElement>:
  // React define onChange como FormEventHandler<HTMLElement>. Lit custom elements
  // disparan CustomEvent — estos tipos son incompatibles bajo tsc estricto sin cast.
  // Al usar WebComponentBaseProps + Record<string, unknown>, el consumidor puede
  // pasar onChange: (e: CustomEvent) => void sin ningún cast en su lado.
  const typesContent = `/**
 * Minimal base props shared by all web component React wrappers.
 * Auto-generated — do not edit manually.
 *
 * WHY NOT React.HTMLAttributes<HTMLElement>:
 * React types onChange as FormEventHandler<HTMLElement>, but Lit custom elements
 * dispatch CustomEvent. These types are structurally incompatible — CustomEvent
 * has .detail, .initCustomEvent, .composed, etc. that FormEvent lacks.
 * Under strict tsc -b this causes a build error in consumer projects.
 *
 * By using this minimal base + Record<string, unknown>, consumers can pass
 * any event handler typed as CustomEvent without casting on their side:
 *
 *   <LibCheckbox onChange={(e: CustomEvent<{ checked: boolean }>) => ...} />
 *
 * Standard structural props (style, className, children, slot, id, ref) are
 * explicitly declared so IDEs provide autocomplete for the most common cases.
 */
export type WebComponentBaseProps = {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  slot?: string;
  id?: string;
  ref?: React.Ref<HTMLElement>;
};
`;

  fs.writeFileSync(path.join(outDirReact, 'types.ts'), typesContent);

  // ── index.ts ──────────────────────────────────────────────────────────────
  const indexLines = [
    `export type { WebComponentBaseProps } from './types.js';`,
    ...componentsList.map(comp => `export * from './${comp.tag}';`),
  ];

  fs.writeFileSync(path.join(outDirReact, 'index.ts'), indexLines.join('\n'));

  console.log('  └─ ✅ React wrappers: generated with WebComponentBaseProps (no HTMLAttributes conflicts).');
}