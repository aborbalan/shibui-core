import type { Meta, StoryObj }  from '@storybook/web-components-vite';
import { html }                 from 'lit';
import './lib-git-graph.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';
import type { GitCommit }       from './lib-git-graph.types';

/* ── Args ── */
interface GitGraphArgs {
  commits:    GitCommit[];
  height:     number;
  rowHeight:  number;
  laneWidth:  number;
  showAuthor: boolean;
  showDate:   boolean;
}

/* ── Mock data: historial realista con 2 feature branches ── */

const MOCK_COMMITS: GitCommit[] = [
  {
    hash:    'a1b2c3d',
    message: 'feat: add git branch visualizer component',
    author:  'Alejandro Borbalán',
    date:    '2026-05-31T10:00:00Z',
    parents: ['e4f5a6b'],
    refs:    ['HEAD -> main', 'origin/main'],
  },
  {
    hash:    'e4f5a6b',
    message: 'Merge branch feature/kintsugi-text',
    author:  'Alejandro Borbalán',
    date:    '2026-05-30T15:30:00Z',
    parents: ['c7d8e9f', 'f0a1b2c'],
    refs:    [],
  },
  {
    hash:    'c7d8e9f',
    message: 'fix: correct token usage in scatter chart',
    author:  'Alejandro Borbalán',
    date:    '2026-05-29T12:00:00Z',
    parents: ['b3c4d5e'],
    refs:    [],
  },
  {
    hash:    'f0a1b2c',
    message: 'feat: kintsugi text legibility tokens',
    author:  'Alejandro Borbalán',
    date:    '2026-05-28T11:00:00Z',
    parents: ['d6e7f8a'],
    refs:    ['feature/kintsugi-text'],
  },
  {
    hash:    'd6e7f8a',
    message: 'chore: add kintsugi base CSS vars',
    author:  'Alejandro Borbalán',
    date:    '2026-05-27T09:30:00Z',
    parents: ['b3c4d5e'],
    refs:    [],
  },
  {
    hash:    'b3c4d5e',
    message: 'Merge branch feature/bar-chart',
    author:  'Alejandro Borbalán',
    date:    '2026-05-26T16:00:00Z',
    parents: ['a9b0c1d', 'e2f3a4b'],
    refs:    [],
  },
  {
    hash:    'a9b0c1d',
    message: 'docs: update KATACHI.md design system docs',
    author:  'Alejandro Borbalán',
    date:    '2026-05-25T14:00:00Z',
    parents: ['c5d6e7f'],
    refs:    [],
  },
  {
    hash:    'e2f3a4b',
    message: 'test: add bar-chart stories and play tests',
    author:  'Alejandro Borbalán',
    date:    '2026-05-24T13:00:00Z',
    parents: ['b8c9d0e'],
    refs:    ['feature/bar-chart'],
  },
  {
    hash:    'b8c9d0e',
    message: 'feat: bar chart stacked and grouped modes',
    author:  'Alejandro Borbalán',
    date:    '2026-05-23T11:00:00Z',
    parents: ['c5d6e7f'],
    refs:    [],
  },
  {
    hash:    'c5d6e7f',
    message: 'refactor: extract shared chart helpers',
    author:  'Alejandro Borbalán',
    date:    '2026-05-22T10:00:00Z',
    parents: ['f1a2b3c'],
    refs:    [],
  },
  {
    hash:    'f1a2b3c',
    message: 'feat: initial scatter chart SVG component',
    author:  'Alejandro Borbalán',
    date:    '2026-05-21T09:00:00Z',
    parents: ['d4e5f6a'],
    refs:    [],
  },
  {
    hash:    'd4e5f6a',
    message: 'chore: setup monorepo pnpm workspaces',
    author:  'Alejandro Borbalán',
    date:    '2026-05-20T08:00:00Z',
    parents: [],
    refs:    ['v1.0.0'],
  },
];

/* Solo rama lineal para historia minimalista */
const LINEAR_COMMITS: GitCommit[] = [
  { hash: 'abc0001', message: 'feat: add dark mode tokens',       author: 'Alejandro', date: '2026-05-31T10:00:00Z', parents: ['abc0002'], refs: ['HEAD -> main'] },
  { hash: 'abc0002', message: 'fix: button focus ring contrast',  author: 'Alejandro', date: '2026-05-30T09:00:00Z', parents: ['abc0003'], refs: [] },
  { hash: 'abc0003', message: 'feat: badge size variants',        author: 'Alejandro', date: '2026-05-29T11:00:00Z', parents: ['abc0004'], refs: [] },
  { hash: 'abc0004', message: 'docs: add component catalog page', author: 'Alejandro', date: '2026-05-28T14:00:00Z', parents: ['abc0005'], refs: [] },
  { hash: 'abc0005', message: 'chore: init project',              author: 'Alejandro', date: '2026-05-27T08:00:00Z', parents: [],          refs: ['v0.1.0'] },
];

/* ── Meta ── */
const meta: Meta<GitGraphArgs> = {
  title:     'Universal/Charts/Git Graph',
  component: 'lib-git-graph',
  tags:      ['autodocs'],

  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: `
**lib-git-graph** · Organismo · \`app/data-viz\`

Visualizador de ramas de git SVG nativo. Renderiza el historial de commits
con carriles de rama, relaciones de parentesco (merges) y etiquetas de
referencia (HEAD, branches, tags).

El componente recibe datos puros (\`commits\`) en orden topológico
(más reciente primero). **No sabe cómo obtener los datos**: en Tauri
los produce un comando Rust (\`invoke('get_git_log', { path })\`);
en web, vienen de la API REST (\`GET /api/v1/git/log\`).

Katachi-aware: ejes y textos consumen tokens semánticos del ancestro.

\`\`\`html
<lib-git-graph
  .commits=\${misCommits}
  height="500"
  show-date
></lib-git-graph>
\`\`\`
        `,
      },
    },
  },

  argTypes: {
    height:     { control: { type: 'number', min: 200, max: 800, step: 50 } },
    rowHeight:  { control: { type: 'number', min: 24,  max: 64,  step: 4  }, name: 'row-height'  },
    laneWidth:  { control: { type: 'number', min: 16,  max: 40,  step: 4  }, name: 'lane-width'  },
    showAuthor: { control: 'boolean', name: 'show-author' },
    showDate:   { control: 'boolean', name: 'show-date'   },
  },

  args: {
    commits:    MOCK_COMMITS,
    height:     420,
    rowHeight:  32,
    laneWidth:  24,
    showAuthor: false,
    showDate:   false,
  },

  render: (args) => html`
    <div style="width: 680px; padding: var(--lib-space-lg);">
      <lib-git-graph
        .commits=${args.commits}
        .height=${args.height}
        .rowHeight=${args.rowHeight}
        .laneWidth=${args.laneWidth}
        ?show-author=${args.showAuthor}
        ?show-date=${args.showDate}
      ></lib-git-graph>
    </div>
  `,
};

export default meta;
type Story = StoryObj<GitGraphArgs>;

/* ─────────────────────────────────────────────────────────────
   STORIES
───────────────────────────────────────────────────────────── */

/** Control de todos los parámetros con historial complejo (2 feature branches). */
export const Playground: Story = {};

/** Historial lineal sin ramas. */
export const Linear: Story = {
  name: 'Lineal — sin ramas',
  args: {
    commits:  LINEAR_COMMITS,
    height:   200,
  },
};

/** Mostrando autor y fecha bajo cada commit. */
export const WithMeta: Story = {
  name: 'Con autor y fecha',
  args: {
    showAuthor: true,
    showDate:   true,
    rowHeight:  44,
    height:     520,
  },
};

/** Sin commits — estado vacío. */
export const Empty: Story = {
  name: 'Sin commits',
  args: {
    commits: [],
    height:  200,
  },
};

/** Un solo commit — commit raíz sin padres. */
export const SingleCommit: Story = {
  name: 'Commit único',
  args: {
    commits: [{
      hash:    'abc1234',
      message: 'chore: init repository',
      author:  'Alejandro Borbalán',
      date:    '2026-05-01T08:00:00Z',
      parents: [],
      refs:    ['HEAD -> main', 'v1.0.0'],
    }],
    height: 100,
  },
};

/* ─────────────────────────────────────────────────────────────
   KATACHI — grafo en cada contexto estético
───────────────────────────────────────────────────────────── */

const _katachi = createKatachiStories<GitGraphArgs>(() => html`
  <div style="
    display: flex;
    flex-direction: column;
    gap: var(--lib-space-md);
    width: 640px;
    padding: var(--lib-space-lg);
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
  ">
    <p style="
      font-family: var(--lib-font-mono);
      font-size: 9px;
      color: var(--text-muted);
      letter-spacing: .16em;
      text-transform: uppercase;
      margin: 0;
    ">git branch graph · 2 feature branches · 12 commits</p>

    <lib-git-graph
      .commits=${MOCK_COMMITS}
      .height=${380}
      .rowHeight=${32}
      .laneWidth=${24}
    ></lib-git-graph>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;
