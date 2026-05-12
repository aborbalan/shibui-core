// packages/ui/scripts/mappers/svelte.mapper.js
import fs from 'fs';
import path from 'path';

export function generateSvelte(manifest) {
  const outDirSvelte = './dist/svelte';
  if (!fs.existsSync(outDirSvelte)) fs.mkdirSync(outDirSvelte, { recursive: true });

  let components = '';

  manifest.modules.forEach(module => {
    module.declarations?.forEach(decl => {
      if (decl.customElement) {
        // Extraemos props del manifest generado por Lit
        const props = decl.members
          ?.filter(m => m.kind === 'field' && m.privacy === 'public')
          .map(m => `      ${m.name}?: ${m.type?.text || 'any'};`)
          .join('\n') || '';

        // Extraemos eventos personalizados (@event)
        const events = decl.events
          ?.map(e => `      'on:${e.name}'?: (e: CustomEvent<any>) => void;`)
          .join('\n') || '';

        components += `    '${decl.tagName}': {\n${props}\n${events}\n    };\n`;
      }
    });
  });

  const template = `
import { HTMLAttributes } from 'svelte/elements';

declare global {
  namespace svelteHTML {
    interface IntrinsicElements {
${components}
    }
  }
}
export {};`;

  fs.writeFileSync(path.join(outDirSvelte, 'shibui-elements.d.ts'), template);
  console.log('  └─ ✅ Svelte types: dist/svelte/shibui-elements.d.ts');
}