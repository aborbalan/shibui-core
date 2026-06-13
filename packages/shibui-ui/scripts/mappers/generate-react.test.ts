import { describe, it, expect, vi, beforeEach } from 'vitest';
import path from 'path';

// ─── Mock de fs ANTES de importar el módulo bajo test ───────────────────────
// Vi.mock se hoista automáticamente al top del fichero por Vitest.
vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(() => true),
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn(),
  },
}));

import fs from 'fs';
import { generateReact } from './generate-react';

// ─── Fixture: manifest mínimo pero representativo ───────────────────────────
const buildManifest = (overrides = {}) => ({
  modules: [
    {
      declarations: [
        {
          customElement: true,
          name: 'LibButton',
          tagName: 'lib-button',
          events: [
            { name: 'ui-lib-click' },
            { name: 'ui-lib-focus-change' },
          ],
          members: [],
          ...overrides,
        },
      ],
    },
  ],
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
/**
 * Devuelve el contenido que se escribió para un fichero concreto.
 * Busca por el basename del path para no acoplar tests a la ruta absoluta.
 */
const getWrittenContent = (filename: string): string => {
  const calls = vi.mocked(fs.writeFileSync).mock.calls;
  const call = calls.find(([filePath]) =>
    (filePath as string).endsWith(filename)
  );
  if (!call) throw new Error(`writeFileSync nunca se llamó con "${filename}"`);
  return call[1] as string;
};

// ─── Tests ───────────────────────────────────────────────────────────────────
describe('generateReact', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Estructura del directorio ─────────────────────────────────────────────
  describe('gestión de directorio', () => {
    it('no crea el directorio si ya existe', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      generateReact(buildManifest());
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });

    it('crea el directorio si no existe', () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);
      generateReact(buildManifest());
      expect(fs.mkdirSync).toHaveBeenCalledWith('./dist/react', { recursive: true });
    });
  });

  // ── Ausencia de directivas prohibidas ────────────────────────────────────
  describe('directivas TypeScript prohibidas', () => {
    it('NO contiene @ts-nocheck', () => {
      generateReact(buildManifest());
      const content = getWrittenContent('lib-button.tsx');
      expect(content).not.toContain('@ts-nocheck');
    });

    it('NO contiene @ts-ignore', () => {
      generateReact(buildManifest());
      const content = getWrittenContent('lib-button.tsx');
      expect(content).not.toContain('@ts-ignore');
    });
  });

  // ── Indentación del fichero generado ─────────────────────────────────────
  describe('indentación', () => {
    it('ninguna línea empieza con más de 2 espacios de indentación en el nivel raíz', () => {
      generateReact(buildManifest());
      const content = getWrittenContent('lib-button.tsx');
      const lines = content.split('\n');

      // Las líneas raíz (import, export, const) no deben tener sangría
      const rootLevelLines = lines.filter(line =>
        line.startsWith('import ') ||
        line.startsWith('export ') ||
        line.startsWith('const ')
      );

      rootLevelLines.forEach(line => {
        expect(line).not.toMatch(/^ {2,}/);
      });
    });

    it('el fichero NO comienza con espacios en blanco', () => {
      generateReact(buildManifest());
      const content = getWrittenContent('lib-button.tsx');
      expect(content).not.toMatch(/^ +/);
    });

    it('las propiedades del objeto events tienen exactamente 2 espacios de sangría', () => {
      generateReact(buildManifest());
      const content = getWrittenContent('lib-button.tsx');

      // Busca las líneas con los event mappings dentro del objeto events
      const eventLines = content
        .split('\n')
        .filter(line => line.includes("'onUiLib"));

      eventLines.forEach(line => {
        expect(line).toMatch(/^  '/); // exactamente 2 espacios
      });
    });
  });

  // ── Tipado correcto ───────────────────────────────────────────────────────
  describe('tipos TypeScript generados', () => {
    it('usa React.ComponentType en lugar de React.FC', () => {
      generateReact(buildManifest());
      const content = getWrittenContent('lib-button.tsx');
      expect(content).toContain('React.ComponentType');
      expect(content).not.toContain('React.FC');
    });

    it('NO usa <any> en ningún tipo', () => {
      generateReact(buildManifest());
      const content = getWrittenContent('lib-button.tsx');
      expect(content).not.toContain('<any>');
      expect(content).not.toContain(': any');
    });

    it('exporta el tipo Props con ComponentPropsWithRef', () => {
      generateReact(buildManifest());
      const content = getWrittenContent('lib-button.tsx');
      expect(content).toContain('ComponentPropsWithRef');
      expect(content).toContain('LibButtonProps');
    });

    it('el cast usa "as unknown as" para ser explícito', () => {
      generateReact(buildManifest());
      const content = getWrittenContent('lib-button.tsx');
      expect(content).toContain('as unknown as React.ComponentType');
    });

    it('incluye un comentario que explica el motivo del cast', () => {
      generateReact(buildManifest());
      const content = getWrittenContent('lib-button.tsx');
      // El cast debe tener documentación inline, no ser un hack silencioso
      expect(content).toContain('// Cast necesario');
    });
  });

  // ── Imports ───────────────────────────────────────────────────────────────
  describe('imports generados', () => {
    it('importa React correctamente', () => {
      generateReact(buildManifest());
      const content = getWrittenContent('lib-button.tsx');
      expect(content).toContain("import React from 'react'");
    });

    it('importa createComponent desde @lit/react', () => {
      generateReact(buildManifest());
      const content = getWrittenContent('lib-button.tsx');
      expect(content).toContain("from '@lit/react'");
      expect(content).toContain('createComponent');
    });

    it('importa el elemento desde ../index.js (con extensión .js para ESM)', () => {
      generateReact(buildManifest());
      const content = getWrittenContent('lib-button.tsx');
      expect(content).toContain("from '../index.js'");
    });
  });

  // ── Mapeo de eventos ──────────────────────────────────────────────────────
  describe('mapeo de eventos a props de React', () => {
    it('convierte ui-lib-click a onUiLibClick', () => {
      generateReact(buildManifest());
      const content = getWrittenContent('lib-button.tsx');
      expect(content).toContain("'onUiLibClick': 'ui-lib-click'");
    });

    it('convierte eventos con múltiples guiones correctamente', () => {
      generateReact(buildManifest());
      const content = getWrittenContent('lib-button.tsx');
      expect(content).toContain("'onUiLibFocusChange': 'ui-lib-focus-change'");
    });

    it('genera events: {} cuando el componente no tiene eventos', () => {
      const manifestSinEventos = buildManifest({ events: undefined });
      generateReact(manifestSinEventos);
      const content = getWrittenContent('lib-button.tsx');
      expect(content).toContain('events: {}');
    });

    it('genera events: {} cuando el array de eventos está vacío', () => {
      const manifestEventosVacios = buildManifest({ events: [] });
      generateReact(manifestEventosVacios);
      const content = getWrittenContent('lib-button.tsx');
      expect(content).toContain('events: {}');
    });
  });

  // ── Comentario de documentación ───────────────────────────────────────────
  describe('comentario JSDoc en el wrapper', () => {
    it('incluye el tag HTML del componente en el comentario', () => {
      generateReact(buildManifest());
      const content = getWrittenContent('lib-button.tsx');
      expect(content).toContain('<lib-button>');
    });

    it('advierte que el fichero es auto-generado', () => {
      generateReact(buildManifest());
      const content = getWrittenContent('lib-button.tsx');
      expect(content).toContain('Auto-generated');
    });
  });

  // ── Fichero index.ts ──────────────────────────────────────────────────────
  describe('index.ts generado', () => {
    it('exporta el componente generado', () => {
      generateReact(buildManifest());
      const content = getWrittenContent('index.ts');
      expect(content).toContain("export * from './lib-button'");
    });

    it('exporta todos los componentes cuando hay varios', () => {
      const manifestMultiple = {
        modules: [
          {
            declarations: [
              { customElement: true, name: 'LibButton', tagName: 'lib-button', events: [] },
              { customElement: true, name: 'LibBadge',  tagName: 'lib-badge',  events: [] },
              { customElement: true, name: 'LibModal',  tagName: 'lib-modal',  events: [] },
            ],
          },
        ],
      };

      generateReact(manifestMultiple);
      const content = getWrittenContent('index.ts');
      expect(content).toContain("export * from './lib-button'");
      expect(content).toContain("export * from './lib-badge'");
      expect(content).toContain("export * from './lib-modal'");
    });

    it('ignora declarations que no son customElement', () => {
      const manifestMixto = {
        modules: [
          {
            declarations: [
              { customElement: true,  name: 'LibButton', tagName: 'lib-button', events: [] },
              { customElement: false, name: 'SomeUtil',  tagName: undefined },
            ],
          },
        ],
      };

      generateReact(manifestMixto);
      const index = getWrittenContent('index.ts');
      expect(index).toContain("export * from './lib-button'");
      expect(index).not.toContain('SomeUtil');
    });

    it('escribe cada export en su propia línea', () => {
      const manifestMultiple = {
        modules: [
          {
            declarations: [
              { customElement: true, name: 'LibButton', tagName: 'lib-button', events: [] },
              { customElement: true, name: 'LibBadge',  tagName: 'lib-badge',  events: [] },
            ],
          },
        ],
      };

      generateReact(manifestMultiple);
      const content = getWrittenContent('index.ts');
      const lines = content.split('\n').filter(Boolean);
      // 1 línea export del tipo base (WebComponentBaseProps) + 2 componentes
      expect(lines).toHaveLength(3);
      expect(content).toContain("export type { WebComponentBaseProps } from './types.js';");
    });
  });

  // ── Llamadas a writeFileSync ──────────────────────────────────────────────
  describe('ficheros escritos', () => {
    it('escribe exactamente 3 ficheros para un componente (wrapper + types.ts + index.ts)', () => {
      generateReact(buildManifest());
      expect(fs.writeFileSync).toHaveBeenCalledTimes(3);
    });

    it('escribe N+2 ficheros para N componentes (N wrappers + types.ts + index.ts)', () => {
      const manifestMultiple = {
        modules: [
          {
            declarations: [
              { customElement: true, name: 'LibButton', tagName: 'lib-button', events: [] },
              { customElement: true, name: 'LibBadge',  tagName: 'lib-badge',  events: [] },
              { customElement: true, name: 'LibModal',  tagName: 'lib-modal',  events: [] },
            ],
          },
        ],
      };

      generateReact(manifestMultiple);
      // 3 wrappers + types.ts + index.ts
      expect(fs.writeFileSync).toHaveBeenCalledTimes(5);
    });

    it('escribe los wrappers en la ruta dist/react/', () => {
      generateReact(buildManifest());
      const calls = vi.mocked(fs.writeFileSync).mock.calls;
      const wrapperCall = calls.find(([p]) => (p as string).endsWith('lib-button.tsx'));
      expect(wrapperCall?.[0]).toBe(path.join('./dist/react', 'lib-button.tsx'));
    });
  });
});