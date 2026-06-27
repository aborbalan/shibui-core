// Fork of lib/preview-gen-storybook.mjs for Lit web components (shibui-ui).
// Reason: shibui stories return Lit TemplateResult from render(), not JSX.
// This fork wraps each story in a React FC that mounts the TemplateResult
// via lit's render() into a <div ref> using useLayoutEffect.

import { relative } from 'node:path';
import { exportName } from '../../.ds-sync/lib/common.mjs';

// compose() returns a React FC instead of a plain render function.
// The FC uses useRef + useLayoutEffect to call litRender on the TemplateResult.
// Story-level and meta-level decorators are applied in finalGet() before render.
const COMPOSE = `function compose(S: any, key: string) {
  const meta: any = S.default ?? {};
  const st: any = S[key];
  const args: any = { ...(meta.args ?? {}), ...(st && st.args ? st.args : {}) };
  const at: any = { ...(meta.argTypes ?? {}), ...(st && st.argTypes ? st.argTypes : {}) };
  for (const k of Object.keys(args)) {
    const m = at[k] && at[k].mapping;
    if (m && typeof m === 'object' && args[k] in m) args[k] = m[args[k]];
  }
  const title: string = typeof meta.title === 'string' ? meta.title : '';
  const ctx: any = {
    args, name: key, title, kind: title, id: '', componentId: '',
    globals: {}, viewMode: 'story',
    parameters: (st && st.parameters) ?? meta.parameters ?? {},
  };
  let getRaw: (() => any) | null = null;
  if (st && typeof st.render === 'function') getRaw = () => st.render(args, ctx);
  else if (typeof st === 'function') getRaw = () => st(args, ctx);
  else if (typeof meta.render === 'function') getRaw = () => meta.render(args, ctx);
  else {
    const C = (st && st.component) || meta.component;
    if (C) getRaw = () => React.createElement(C, args);
  }
  if (!getRaw) return () => null;
  const decorators: any[] = ([] as any[]).concat((st && st.decorators) ?? []).concat(meta.decorators ?? []);
  const baseGet = getRaw;
  const finalGet = decorators.reduce((inner: any, dec: any) => () => {
    const out = dec(inner, ctx);
    return out === undefined ? inner() : out;
  }, baseGet);
  return function LitPreview() {
    const ref = React.useRef<HTMLDivElement>(null);
    React.useLayoutEffect(() => {
      if (!ref.current) return;
      const result = finalGet();
      if (result != null && typeof result === 'object' && '_$litType$' in result) {
        litRender(result, ref.current);
      }
    }, []);
    return React.createElement('div', { ref });
  };
}`;

export function generatePreviewSource(c, opts) {
  const skipSet = new Set(opts.skip ?? []);
  const visible = (c.storyIds ?? []).filter((s) => !skipSet.has(s.id));
  const paired = visible.filter((s) => s.exportKey);
  if (!c.storySrc || paired.length === 0) {
    if (c.storySrc && visible.length > 0) {
      console.error(`  (preview: ${c.name} — no story exports paired (storyName overrides?); showing the floor card)`);
    }
    return null;
  }
  const toSpec = (p) => {
    const rel = relative(process.cwd(), p).replace(/\\/g, '/');
    return JSON.stringify(`@ds-stories/${rel}`.replace(/\.[cm]?[jt]sx?$/, ''));
  };
  const modVars = new Map();
  const modVarFor = (p) => {
    if (!modVars.has(p)) modVars.set(p, modVars.size === 0 ? 'S' : `S${modVars.size + 1}`);
    return modVars.get(p);
  };
  const seen = new Set();
  const used = new Set();
  const lines = [];
  for (const s of paired) {
    const mod = modVarFor(s.storySrc ?? c.storySrc);
    const dupKey = `${mod}:${s.exportKey}`;
    if (seen.has(dupKey)) {
      console.error(`  (preview: ${c.name} — story "${s.name}" pairs to already-emitted export ${s.exportKey}; skipping duplicate)`);
      continue;
    }
    seen.add(dupKey);
    const label = exportName(s.exportKey, used);
    s.emitted = label;
    lines.push(`export const ${label} = /* ${s.name} */ compose(${mod}, ${JSON.stringify(s.exportKey)});`);
  }
  const imports = [...modVars.entries()]
    .map(([p, v]) => `import * as ${v} from ${toSpec(p)};`)
    .join('\n');
  return `import * as React from 'react';
import { render as litRender } from 'lit';
${imports}

${COMPOSE}

${lines.join('\n')}
`;
}
