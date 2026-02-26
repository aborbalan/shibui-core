# 🎌 Guía de Despliegue NPM — `@shibui/ui`

> **Shibui (渋い)** — Elegancia discreta. Belleza funcional que no se impone.

Este documento recoge la configuración técnica, la identidad de marca y el flujo completo de publicación para la librería de componentes `@shibui/ui`.

---

## 1. Identidad de Marca

| Campo | Valor |
|---|---|
| Scope NPM | `@shibui/ui` |
| Org sugerida | `shibui-studio` o `shibui-lab` |
| Filosofía | Ligero, agnóstico, sin complejidad innecesaria |

> Los paquetes bajo un scope pueden ser **públicos y gratuitos**. Publicar siempre con `--access public`.

---

## 2. Configuración del Proyecto

### `package.json`

Puntos de entrada para que el consumidor encuentre los componentes y sus tipos correctamente:

```json
{
  "name": "@shibui/ui",
  "version": "0.0.1",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.ts"
    }
  },
  "files": ["dist"],
  "private": true
}
```

> ⚠️ Recuerda eliminar `"private": true` antes de publicar.

---

### `vite.config.ts` — Library Mode

Configuración para garantizar tree-shaking y generación de tipos:

- **Plugin:** `vite-plugin-dts` debe estar en la raíz del array `plugins`, no dentro de la configuración de tests.
- **Build → lib:**
  - `entry`: `src/index.ts`
  - `fileName`: `index`
  - `formats`: `['es']`
- **Rollup options:**
  - `external`: `['lit', 'lit/decorators.js', ...]` — evita duplicar dependencias en el bundle.
  - `preserveModules: true` — mantiene la estructura de módulos para una carga optimizada y mejor tree-shaking.

---

## 3. Scripts útiles

Añade estos comandos a tu `package.json` para agilizar el flujo de trabajo:

| Comando | Acción |
|---|---|
| `npm run build` | Compila la librería y genera los tipos en `/dist` |
| `npm run pack:local` | Ejecuta `build` y genera un `.tgz` para pruebas locales |
| `npm login` | Autenticación única en los servidores de NPM |
| `npm publish --access public` | Publicación final como paquete público |

---

## 4. Flujo de Pruebas Locales

Antes de publicar, valida la librería instalándola en un proyecto real sin necesidad de subirla a NPM.

1. Ejecutar en la carpeta de la librería:
   ```bash
   npm run pack:local
   ```

2. Se genera un archivo como `shibui-ui-0.0.1.tgz`.

3. En el proyecto de destino, instalar el archivo local:
   ```bash
   npm install ../ruta/al/archivo/shibui-ui-0.0.1.tgz
   ```

4. Importar los componentes normalmente:
   ```ts
   import '@shibui/ui/lib-data-table';
   ```

---

## 5. Checklist de Publicación

- [ ] `npm run build` ejecutado sin errores
- [ ] Tipos generados en `/dist/index.ts`
- [ ] Probado localmente con `.tgz`
- [ ] `"private": true` eliminado del `package.json`
- [ ] Versión actualizada en `package.json`
- [ ] `npm login` activo
- [ ] `npm publish --access public`
