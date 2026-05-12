// vite.config.ts
import { defineConfig } from "file:///D:/PROYECTOS/shibui-ecosystem/node_modules/vite/dist/node/index.js";
import { resolve } from "path";
import dts from "file:///D:/PROYECTOS/shibui-ecosystem/node_modules/vite-plugin-dts/dist/index.mjs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "file:///D:/PROYECTOS/shibui-ecosystem/node_modules/@storybook/addon-vitest/dist/vitest-plugin/index.js";
var __vite_injected_original_dirname = "D:\\PROYECTOS\\shibui-ecosystem\\packages\\shibui-ui";
var __vite_injected_original_import_meta_url = "file:///D:/PROYECTOS/shibui-ecosystem/packages/shibui-ui/vite.config.ts";
var dirname = typeof __vite_injected_original_dirname !== "undefined" ? __vite_injected_original_dirname : path.dirname(fileURLToPath(__vite_injected_original_import_meta_url));
var config = {
  plugins: [
    dts({ insertTypesEntry: true, tsconfigPath: "./tsconfig.json", rollupTypes: false, entryRoot: "src" })
  ],
  server: {
    // Suppress Vite banner/logo in terminal
    open: true,
    host: true
  },
  logLevel: "warn",
  // Reduce console output
  build: {
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "ShibuiUI",
      fileName: "index",
      formats: ["es"]
    },
    rollupOptions: {
      // Externalize Lit as peer dependency
      external: ["lit", "lit/decorators.js", "lit/directive.js", "lit/directives/*"],
      output: {
        // Preserve export names for tree-shaking
        preserveModules: true,
        preserveModulesRoot: "src"
      }
    },
    // Size optimizations
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // Aggressive tree-shaking
    cssCodeSplit: false,
    sourcemap: true
  },
  css: {
    // Modern native CSS - no heavy preprocessors
    devSourcemap: true
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
        // The plugin will run tests for the stories defined in your Storybook config
        // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
        storybookTest({
          configDir: path.join(dirname, ".storybook")
        })
      ],
      test: {
        name: "storybook",
        browser: {
          enabled: true,
          headless: true,
          instances: [{
            browser: "chromium"
          }]
        },
        setupFiles: [".storybook/vitest.setup.ts"]
      }
    }]
  }
};
var vite_config_default = defineConfig(config);
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQUk9ZRUNUT1NcXFxcc2hpYnVpLWVjb3N5c3RlbVxcXFxwYWNrYWdlc1xcXFxzaGlidWktdWlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFBST1lFQ1RPU1xcXFxzaGlidWktZWNvc3lzdGVtXFxcXHBhY2thZ2VzXFxcXHNoaWJ1aS11aVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovUFJPWUVDVE9TL3NoaWJ1aS1lY29zeXN0ZW0vcGFja2FnZXMvc2hpYnVpLXVpL3ZpdGUuY29uZmlnLnRzXCI7Ly8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlc3QvY29uZmlnXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwidml0ZXN0XCIgLz5cbmltcG9ydCB7IGRlZmluZUNvbmZpZywgVGVyc2VyT3B0aW9ucywgdHlwZSBVc2VyQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cyc7XG4vKipcbiAqIFZpdGUgY29uZmlndXJhdGlvbiBmb3IgVUkgbGlicmFyeVxuICogXG4gKiBHb2FsczpcbiAqIC0gUmVhbCB0cmVlLXNoYWtpbmcgKFplcm8tQmxvYXQpXG4gKiAtIE9wdGltaXplZCBidWlsZCBmb3IgZGlzdHJpYnV0aW9uXG4gKiAtIFN1cHBvcnQgZm9yIG1vZGVybiBuYXRpdmUgQ1NTXG4gKi9cbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAnbm9kZTp1cmwnO1xuaW1wb3J0IHsgc3Rvcnlib29rVGVzdCB9IGZyb20gJ0BzdG9yeWJvb2svYWRkb24tdml0ZXN0L3ZpdGVzdC1wbHVnaW4nO1xuaW1wb3J0IHsgSW5saW5lQ29uZmlnIH0gZnJvbSAndml0ZXN0L25vZGUnO1xuY29uc3QgZGlybmFtZSA9IHR5cGVvZiBfX2Rpcm5hbWUgIT09ICd1bmRlZmluZWQnID8gX19kaXJuYW1lIDogcGF0aC5kaXJuYW1lKGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKSk7XG5cbmNvbnN0IGNvbmZpZzogVXNlckNvbmZpZyAmIHsgdGVzdD86IElubGluZUNvbmZpZyB9ID0ge1xuICBwbHVnaW5zOltcbiAgICBkdHMoeyBpbnNlcnRUeXBlc0VudHJ5OiB0cnVlLHRzY29uZmlnUGF0aDogJy4vdHNjb25maWcuanNvbicscm9sbHVwVHlwZXM6IGZhbHNlLGVudHJ5Um9vdDogJ3NyYycgfSksXG4gIF0sXG4gIHNlcnZlcjoge1xuICAgIC8vIFN1cHByZXNzIFZpdGUgYmFubmVyL2xvZ28gaW4gdGVybWluYWxcbiAgICBvcGVuOiB0cnVlLFxuICAgIGhvc3Q6IHRydWVcbiAgfSxcbiAgbG9nTGV2ZWw6ICd3YXJuJyxcbiAgLy8gUmVkdWNlIGNvbnNvbGUgb3V0cHV0XG4gIGJ1aWxkOiB7XG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvaW5kZXgudHMnKSxcbiAgICAgIG5hbWU6ICdTaGlidWlVSScsXG4gICAgICBmaWxlTmFtZTogJ2luZGV4JyxcbiAgICAgIGZvcm1hdHM6IFsnZXMnXVxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgLy8gRXh0ZXJuYWxpemUgTGl0IGFzIHBlZXIgZGVwZW5kZW5jeVxuICAgICAgZXh0ZXJuYWw6IFsnbGl0JywgJ2xpdC9kZWNvcmF0b3JzLmpzJywgJ2xpdC9kaXJlY3RpdmUuanMnLCAnbGl0L2RpcmVjdGl2ZXMvKiddLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIC8vIFByZXNlcnZlIGV4cG9ydCBuYW1lcyBmb3IgdHJlZS1zaGFraW5nXG4gICAgICAgIHByZXNlcnZlTW9kdWxlczogdHJ1ZSxcbiAgICAgICAgcHJlc2VydmVNb2R1bGVzUm9vdDogJ3NyYydcbiAgICAgIH1cbiAgICB9LFxuICAgIC8vIFNpemUgb3B0aW1pemF0aW9uc1xuICAgIG1pbmlmeTogJ3RlcnNlcicsXG4gICAgdGVyc2VyT3B0aW9uczoge1xuICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLFxuICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlXG4gICAgICB9YXMgVGVyc2VyT3B0aW9ucyxcbiAgICB9LFxuICAgIC8vIEFnZ3Jlc3NpdmUgdHJlZS1zaGFraW5nXG4gICAgY3NzQ29kZVNwbGl0OiBmYWxzZSxcbiAgICBzb3VyY2VtYXA6IHRydWVcbiAgfSxcbiAgY3NzOiB7XG4gICAgLy8gTW9kZXJuIG5hdGl2ZSBDU1MgLSBubyBoZWF2eSBwcmVwcm9jZXNzb3JzXG4gICAgZGV2U291cmNlbWFwOiB0cnVlXG4gIH0sXG4gIHRlc3Q6IHtcbiAgICBwcm9qZWN0czogW3tcbiAgICAgIGV4dGVuZHM6IHRydWUsXG4gICAgICBwbHVnaW5zOiBbXG4gICAgICAgIFxuICAgICAgLy8gVGhlIHBsdWdpbiB3aWxsIHJ1biB0ZXN0cyBmb3IgdGhlIHN0b3JpZXMgZGVmaW5lZCBpbiB5b3VyIFN0b3J5Ym9vayBjb25maWdcbiAgICAgIC8vIFNlZSBvcHRpb25zIGF0OiBodHRwczovL3N0b3J5Ym9vay5qcy5vcmcvZG9jcy9uZXh0L3dyaXRpbmctdGVzdHMvaW50ZWdyYXRpb25zL3ZpdGVzdC1hZGRvbiNzdG9yeWJvb2t0ZXN0XG4gICAgICBzdG9yeWJvb2tUZXN0KHtcbiAgICAgICAgY29uZmlnRGlyOiBwYXRoLmpvaW4oZGlybmFtZSwgJy5zdG9yeWJvb2snKVxuICAgICAgfSldLFxuICAgICAgdGVzdDoge1xuICAgICAgICBuYW1lOiAnc3Rvcnlib29rJyxcbiAgICAgICAgYnJvd3Nlcjoge1xuICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgaGVhZGxlc3M6IHRydWUsXG4gICAgICAgICAgaW5zdGFuY2VzOiBbe1xuICAgICAgICAgICAgYnJvd3NlcjogJ2Nocm9taXVtJ1xuICAgICAgICAgIH1dXG4gICAgICAgIH0sXG4gICAgICAgIHNldHVwRmlsZXM6IFsnLnN0b3J5Ym9vay92aXRlc3Quc2V0dXAudHMnXVxuICAgICAgfVxuICAgIH1dXG4gIH1cbn1cblxuLy8gTW9yZSBpbmZvIGF0OiBodHRwczovL3N0b3J5Ym9vay5qcy5vcmcvZG9jcy9uZXh0L3dyaXRpbmctdGVzdHMvaW50ZWdyYXRpb25zL3ZpdGVzdC1hZGRvblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKGNvbmZpZyk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUVBLFNBQVMsb0JBQW9EO0FBQzdELFNBQVMsZUFBZTtBQUN4QixPQUFPLFNBQVM7QUFTaEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMscUJBQXFCO0FBQzlCLFNBQVMscUJBQXFCO0FBZjlCLElBQU0sbUNBQW1DO0FBQXdLLElBQU0sMkNBQTJDO0FBaUJsUSxJQUFNLFVBQVUsT0FBTyxxQ0FBYyxjQUFjLG1DQUFZLEtBQUssUUFBUSxjQUFjLHdDQUFlLENBQUM7QUFFMUcsSUFBTSxTQUErQztBQUFBLEVBQ25ELFNBQVE7QUFBQSxJQUNOLElBQUksRUFBRSxrQkFBa0IsTUFBSyxjQUFjLG1CQUFrQixhQUFhLE9BQU0sV0FBVyxNQUFNLENBQUM7QUFBQSxFQUNwRztBQUFBLEVBQ0EsUUFBUTtBQUFBO0FBQUEsSUFFTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsVUFBVTtBQUFBO0FBQUEsRUFFVixPQUFPO0FBQUEsSUFDTCxLQUFLO0FBQUEsTUFDSCxPQUFPLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQ3hDLE1BQU07QUFBQSxNQUNOLFVBQVU7QUFBQSxNQUNWLFNBQVMsQ0FBQyxJQUFJO0FBQUEsSUFDaEI7QUFBQSxJQUNBLGVBQWU7QUFBQTtBQUFBLE1BRWIsVUFBVSxDQUFDLE9BQU8scUJBQXFCLG9CQUFvQixrQkFBa0I7QUFBQSxNQUM3RSxRQUFRO0FBQUE7QUFBQSxRQUVOLGlCQUFpQjtBQUFBLFFBQ2pCLHFCQUFxQjtBQUFBLE1BQ3ZCO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFFQSxRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDYixVQUFVO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxlQUFlO0FBQUEsTUFDakI7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUVBLGNBQWM7QUFBQSxJQUNkLFdBQVc7QUFBQSxFQUNiO0FBQUEsRUFDQSxLQUFLO0FBQUE7QUFBQSxJQUVILGNBQWM7QUFBQSxFQUNoQjtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0osVUFBVSxDQUFDO0FBQUEsTUFDVCxTQUFTO0FBQUEsTUFDVCxTQUFTO0FBQUE7QUFBQTtBQUFBLFFBSVQsY0FBYztBQUFBLFVBQ1osV0FBVyxLQUFLLEtBQUssU0FBUyxZQUFZO0FBQUEsUUFDNUMsQ0FBQztBQUFBLE1BQUM7QUFBQSxNQUNGLE1BQU07QUFBQSxRQUNKLE1BQU07QUFBQSxRQUNOLFNBQVM7QUFBQSxVQUNQLFNBQVM7QUFBQSxVQUNULFVBQVU7QUFBQSxVQUNWLFdBQVcsQ0FBQztBQUFBLFlBQ1YsU0FBUztBQUFBLFVBQ1gsQ0FBQztBQUFBLFFBQ0g7QUFBQSxRQUNBLFlBQVksQ0FBQyw0QkFBNEI7QUFBQSxNQUMzQztBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFDRjtBQUdBLElBQU8sc0JBQVEsYUFBYSxNQUFNOyIsCiAgIm5hbWVzIjogW10KfQo=
