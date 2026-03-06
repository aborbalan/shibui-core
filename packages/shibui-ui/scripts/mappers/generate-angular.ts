import fs from 'fs';
import path from 'path';

export function generateAngular(manifest) {
  const outDirAngular = './dist/angular';
  if (!fs.existsSync(outDirAngular)) fs.mkdirSync(outDirAngular, { recursive: true });

  let directives = "import { Directive, EventEmitter, Output, Input } from '@angular/core';\n\n";

  manifest.modules.forEach(module => {
    module.declarations?.forEach(decl => {
      if (decl.customElement) {
        const className = `${decl.name}Directive`;
        
        directives += `@Directive({\n  selector: '${decl.tagName}',\n  standalone: true\n})\n`;
        directives += `export class ${className} {\n`;
        
        // Generar Inputs desde las properties
        decl.members?.filter(m => m.kind === 'field' && m.privacy === 'public').forEach(prop => {
          directives += `  @Input() ${prop.name}: any;\n`;
        });

        // Generar Outputs desde los eventos
        decl.events?.forEach(event => {
          const outputName = event.name.replace(/-/g, '_');
          directives += `  @Output() ${outputName} = new EventEmitter<CustomEvent>();\n`;
        });

        directives += `}\n\n`;
      }
    });
  });

  fs.writeFileSync(path.join(outDirAngular, 'directives.ts'), directives);
  console.log('  └─ ✅ Angular directives: dist/angular/directives.ts');
}