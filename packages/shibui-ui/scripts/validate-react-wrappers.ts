#!/usr/bin/env node
// scripts/validate-react-wrappers.ts
//
// Script de validación de integración para los wrappers de React generados.
// Se ejecuta DESPUÉS del build completo para verificar que el output en
// dist/react/ cumple los contratos esperados.
//
// Niveles de validación:
//   1. Forma del fichero generado (indentación, tipos, directivas)
//   2. Compilación TypeScript sin errores
//   3. Resolución de imports desde app-react
//
// Uso:
//   pnpm validate:wrappers
//   node --loader tsx scripts/validate-react-wrappers.ts

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// ─── Configuración ────────────────────────────────────────────────────────────
const DIST_REACT    = path.resolve('./dist/react');
const INDEX_FILE    = path.join(DIST_REACT, 'index.ts');
const APP_REACT_DIR = path.resolve('../../apps/app-react');

type Result = { ok: boolean; message: string };

// ─── Utilidades ──────────────────────────────────────────────────────────────
const pass  = (msg: string): Result => ({ ok: true,  message: `  ✅ ${msg}` });
const fail  = (msg: string): Result => ({ ok: false, message: `  ❌ ${msg}` });
const title = (msg: string): void   => console.log(`\n${'─'.repeat(50)}\n  ${msg}\n${'─'.repeat(50)}`);

function report(results: Result[]): void {
  results.forEach(r => console.log(r.message));
  const failures = results.filter(r => !r.ok);
  if (failures.length > 0) {
    console.log(`\n  ⛔ ${failures.length} validación(es) fallidas.\n`);
    process.exit(1);
  }
  console.log(`\n  ✨ Todas las validaciones pasaron.\n`);
}

// ─── Nivel 1: Forma del fichero generado ─────────────────────────────────────
function validateFileShape(): Result[] {
  title('Nivel 1 — Forma del fichero generado');

  if (!fs.existsSync(DIST_REACT)) {
    return [fail(`dist/react/ no existe. Ejecuta "npm run build" primero.`)];
  }

  const wrappers = fs.readdirSync(DIST_REACT).filter(f => f.endsWith('.tsx'));

  if (wrappers.length === 0) {
    return [fail('No se encontraron ficheros .tsx en dist/react/')];
  }

  const results: Result[] = [];
  results.push(pass(`Se encontraron ${wrappers.length} wrapper(s): ${wrappers.join(', ')}`));

  for (const wrapper of wrappers) {
    const filePath = path.join(DIST_REACT, wrapper);
    const content  = fs.readFileSync(filePath, 'utf-8');
    const lines    = content.split('\n');

    // — Directivas prohibidas —
    if (content.includes('@ts-nocheck')) {
      results.push(fail(`${wrapper}: contiene @ts-nocheck`));
    } else {
      results.push(pass(`${wrapper}: sin @ts-nocheck`));
    }

    if (content.includes('@ts-ignore')) {
      results.push(fail(`${wrapper}: contiene @ts-ignore`));
    } else {
      results.push(pass(`${wrapper}: sin @ts-ignore`));
    }

    // — Tipado —
    if (content.includes('React.FC')) {
      results.push(fail(`${wrapper}: usa React.FC (debería ser React.ComponentType)`));
    } else {
      results.push(pass(`${wrapper}: no usa React.FC`));
    }

    if (content.includes('<any>') || content.includes(': any')) {
      results.push(fail(`${wrapper}: contiene tipo "any"`));
    } else {
      results.push(pass(`${wrapper}: sin tipo "any"`));
    }

    if (!content.includes('ComponentPropsWithRef')) {
      results.push(fail(`${wrapper}: falta ComponentPropsWithRef en el tipo Props`));
    } else {
      results.push(pass(`${wrapper}: usa ComponentPropsWithRef`));
    }

    // — Indentación: las líneas raíz no deben tener sangría —
    const badIndentLines = lines.filter(line =>
      /^import |^export |^const /.test(line) && /^ +/.test(line)
    );
    if (badIndentLines.length > 0) {
      results.push(fail(`${wrapper}: líneas raíz con sangría incorrecta:\n${badIndentLines.slice(0,3).join('\n')}`));
    } else {
      results.push(pass(`${wrapper}: indentación correcta`));
    }

    // — ESM: import con extensión .js —
    if (!content.includes("from '../index.js'")) {
      results.push(fail(`${wrapper}: falta extensión .js en el import del elemento`));
    } else {
      results.push(pass(`${wrapper}: import ESM con extensión .js`));
    }
  }

  // — index.ts —
  if (!fs.existsSync(INDEX_FILE)) {
    results.push(fail('index.ts no existe en dist/react/'));
  } else {
    const indexContent = fs.readFileSync(INDEX_FILE, 'utf-8');
    const exportLines  = indexContent.split('\n').filter(Boolean);
    results.push(pass(`index.ts: ${exportLines.length} export(s) encontrados`));

    // Cada wrapper debe tener su export correspondiente
    for (const wrapper of wrappers) {
      const tag = wrapper.replace('.tsx', '');
      if (!indexContent.includes(`'./${tag}'`)) {
        results.push(fail(`index.ts: falta export para '${tag}'`));
      }
    }
  }

  return results;
}

// ─── Nivel 2: Compilación TypeScript ─────────────────────────────────────────
function validateTypeScript(): Result[] {
  title('Nivel 2 — Compilación TypeScript');

  const results: Result[] = [];

  try {
    // type-check de la librería completa (incluye dist/ mediante paths)
    execSync('pnpm run type-check', { stdio: 'pipe', cwd: process.cwd() });
    results.push(pass('type-check de shibui-ui pasó sin errores'));
  } catch (err: unknown) {
    const output = err instanceof Error && 'stdout' in err
      ? String((err as NodeJS.ErrnoException & { stdout: Buffer }).stdout)
      : String(err);
    results.push(fail(`type-check falló:\n${output.slice(0, 500)}`));
  }

  // tsc directo sobre dist/react/index.ts para aislar errores del wrapper
  try {
    execSync(
      'npx tsc --noEmit --strict --esModuleInterop --moduleResolution bundler dist/react/index.ts',
      { stdio: 'pipe', cwd: process.cwd() }
    );
    results.push(pass('tsc directo sobre dist/react/index.ts pasó'));
  } catch (err: unknown) {
    const output = err instanceof Error && 'stderr' in err
      ? String((err as NodeJS.ErrnoException & { stderr: Buffer }).stderr)
      : String(err);
    // Es esperado que haya errores de módulos no encontrados (lit, react)
    // en este modo. Lo que NO debe haber son errores de tipos internos.
    const internalErrors = output
      .split('\n')
      .filter(line => line.includes('error TS') && !line.includes('Cannot find module'));

    if (internalErrors.length > 0) {
      results.push(fail(`Errores de tipos internos en los wrappers:\n${internalErrors.slice(0, 5).join('\n')}`));
    } else {
      results.push(pass('Sin errores de tipos internos en los wrappers'));
    }
  }

  return results;
}

// ─── Nivel 3: Resolución de imports desde app-react ──────────────────────────
function validateAppReactImports(): Result[] {
  title('Nivel 3 — Resolución de imports desde app-react');

  const results: Result[] = [];

  if (!fs.existsSync(APP_REACT_DIR)) {
    results.push(fail(`apps/app-react no encontrado en: ${APP_REACT_DIR}`));
    return results;
  }

  // Busca ficheros .tsx que importen de @shibui-ui/ui/react
  const srcDir     = path.join(APP_REACT_DIR, 'src');
  const tsxFiles   = findFiles(srcDir, '.tsx');
  const importers  = tsxFiles.filter(f => {
    const content = fs.readFileSync(f, 'utf-8');
    return content.includes("from '@shibui-ui/ui/react'");
  });

  if (importers.length === 0) {
    results.push(fail('No se encontraron ficheros que importen de @shibui-ui/ui/react'));
    return results;
  }

  results.push(pass(`${importers.length} fichero(s) importan de @shibui-ui/ui/react`));

  // Extrae los nombres importados y verifica que existen en dist/react/index.ts
  if (fs.existsSync(INDEX_FILE)) {
    const indexContent = fs.readFileSync(INDEX_FILE, 'utf-8');

    for (const file of importers.slice(0, 5)) { // máximo 5 para no saturar el output
      const content  = fs.readFileSync(file, 'utf-8');
      const match    = content.match(/import\s*\{([^}]+)\}\s*from\s*'@shibui-ui\/ui\/react'/);
      if (!match) continue;

      const imports  = match[1].split(',').map(s => s.trim()).filter(Boolean);
      const basename = path.relative(srcDir, file);

      for (const imp of imports) {
        // Extrae el nombre base (sin alias: "LibButton as Btn" → "LibButton")
        const name = imp.split(' as ')[0].trim();
        if (!indexContent.includes(name)) {
          results.push(fail(`${basename}: "${name}" no está exportado en dist/react/index.ts`));
        } else {
          results.push(pass(`${basename}: "${name}" resuelve correctamente`));
        }
      }
    }
  }

  // type-check de app-react
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe', cwd: APP_REACT_DIR });
    results.push(pass('type-check de app-react pasó sin errores'));
  } catch (err: unknown) {
    const output = err instanceof Error && 'stdout' in err
      ? String((err as NodeJS.ErrnoException & { stdout: Buffer }).stdout)
      : String(err);
    const wrapperErrors = output
      .split('\n')
      .filter(line => line.includes('shibui-ui') || line.includes('@shibui'));

    if (wrapperErrors.length > 0) {
      results.push(fail(`Errores relacionados con los wrappers en app-react:\n${wrapperErrors.slice(0, 5).join('\n')}`));
    } else if (output.includes('error TS')) {
      results.push(pass('type-check de app-react: errores existentes no son de los wrappers'));
    } else {
      results.push(pass('type-check de app-react pasó sin errores'));
    }
  }

  return results;
}

// ─── Utilidad: buscar ficheros recursivamente ─────────────────────────────────
function findFiles(dir: string, ext: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return findFiles(full, ext);
    if (entry.isFile() && entry.name.endsWith(ext)) return [full];
    return [];
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function main(): void {
  console.log('\n🔍  Validando React wrappers generados...');

  const level1 = validateFileShape();
  const level2 = validateTypeScript();
  const level3 = validateAppReactImports();

  report([...level1, ...level2, ...level3]);
}

main();