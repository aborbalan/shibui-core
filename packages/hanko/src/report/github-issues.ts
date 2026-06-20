/* ============================================================
   hanko · Emisor de issues de GitHub (opt-in)

   Convierte el Trust Report en trabajo accionable: un issue de
   GitHub por componente SIN sello (`trusted:false`), con sus
   `findings` en el cuerpo. NO es comportamiento por defecto — lo
   dispara el runner `issues-run.ts` (CLI local) o un step de CI
   gateado por `workflow_dispatch`. El `report` por defecto no lo toca.

   Dos mitades:
     · `toIssueDrafts` — PURO: TrustReport → borradores de issue.
       Sin red, sin Node-API. Testeable en memoria.
     · `syncGithubIssues` — orquesta el diff IDEMPOTENTE contra un
       `GithubClient` inyectable (create / update / close). Re-correrlo
       no duplica: cada issue lleva un marcador estable por componente
       en su cuerpo, y la sincronización casa por ese marcador.

   Cliente real (`RestGithubClient`): `fetch` global contra la REST
   API de GitHub. CERO dependencias nuevas. NO importa shibui (vive en
   la capa de tooling; respeta `genericity.test.ts`).

   Spec: docs/specs/github-issues.md
   ============================================================ */
import type { TrustReport, ComponentTrust } from './trust-report';

/** Label que marca todos los issues gestionados por hanko (clave del listado). */
export const HANKO_LABEL = 'hanko';

/** URL pública del Trust Report; se enlaza desde cada issue. */
const REPORT_URL = 'https://hanko-report.web.app';

/** Comentario al cerrar un issue cuyo componente volvió a sellar. */
const RESOLVED_COMMENT =
  '✅ Resuelto por hanko: el componente vuelve a pasar todas sus capas. Cierro automáticamente.';

/** Borrador de un issue listo para crear/actualizar. Forma agnóstica del transporte. */
export interface IssueDraft {
  /** Marcador estable e invisible (HTML comment) que identifica al componente. */
  marker: string;
  title: string;
  body: string;
  labels: string[];
}

/** Issue abierto ya existente, tal como lo necesita la sincronización. */
export interface ExistingIssue {
  number: number;
  /** Cuerpo del issue (de él se parsea el marcador). */
  body: string;
}

/**
 * Puerto mínimo hacia GitHub. Se inyecta un fake en los tests (sin red) y el
 * `RestGithubClient` real en producción.
 */
export interface GithubClient {
  /** Issues ABIERTOS con el label dado (ya sin pull requests). */
  listOpenIssues(label: string): Promise<ExistingIssue[]>;
  createIssue(draft: IssueDraft): Promise<void>;
  updateIssue(issueNumber: number, draft: IssueDraft): Promise<void>;
  closeIssue(issueNumber: number, comment: string): Promise<void>;
}

/** Resumen de la sincronización para loguear. */
export interface SyncSummary {
  created: number;
  updated: number;
  closed: number;
}

export interface SyncOptions {
  /** `true` → no muta nada; solo calcula y devuelve el plan. */
  dryRun?: boolean;
}

/** Marcador invisible por componente; la sincronización casa los issues por él. */
function markerFor(tagName: string): string {
  return `<!-- hanko:component=${tagName} -->`;
}

const MARKER_RE = /<!-- hanko:component=([a-z][a-z0-9._-]*) -->/;

/** Extrae el tagName del marcador de un cuerpo de issue. `undefined` si no lo lleva. */
export function parseMarker(body: string | undefined): string | undefined {
  if (body === undefined) return undefined;
  const m = MARKER_RE.exec(body);
  return m?.[1];
}

/** Compone el borrador de issue de un componente sin sello. */
function draftFor(c: ComponentTrust): IssueDraft {
  const marker = markerFor(c.tagName);
  const failed = c.layers.filter((l) => l.status === 'fail');
  const n = c.findings.length;

  const title = `[hanko] ${c.tagName} — ${n} violación${n === 1 ? '' : 'es'} de confianza`;

  const findingsList = c.findings.map((f) => `- ${f}`).join('\n');
  const layersLine = failed.map((l) => `\`${l.layer}\``).join(' · ');

  const body = [
    marker,
    `## 判 ${c.tagName} no pasa el sello de confianza`,
    '',
    `**Capas que fallan:** ${layersLine}`,
    '',
    '### Hallazgos',
    findingsList,
    '',
    `---`,
    `Trust Report completo: ${REPORT_URL}`,
    '',
    `> Issue generado automáticamente por **hanko**. No edites el marcador del`,
    `> principio del cuerpo: es la clave de deduplicación. Se cierra solo cuando`,
    `> el componente vuelve a sellar.`,
  ].join('\n');

  const labels = [HANKO_LABEL, ...failed.map((l) => `${HANKO_LABEL}:${l.layer}`)];

  return { marker, title, body, labels };
}

/**
 * PURO: Trust Report → borradores de issue. Un borrador por componente
 * `trusted:false` con al menos un hallazgo. Los componentes sellados y los
 * que solo acumulan warnings no generan trabajo.
 */
export function toIssueDrafts(report: TrustReport): IssueDraft[] {
  const drafts: IssueDraft[] = [];
  for (const c of report.components) {
    if (c.trusted || c.findings.length === 0) continue;
    drafts.push(draftFor(c));
  }
  return drafts;
}

/**
 * Sincroniza los issues de GitHub con el Trust Report, de forma idempotente:
 *   · componente sin sello y sin issue abierto → `createIssue`.
 *   · componente sin sello con issue abierto    → `updateIssue` (refresca cuerpo/labels).
 *   · issue abierto de hanko cuyo componente ya no aparece (volvió a sellar o
 *     desapareció del CEM) → `closeIssue`.
 * Re-correrlo no duplica: el casamiento es por el marcador del cuerpo.
 */
export async function syncGithubIssues(
  report: TrustReport,
  client: GithubClient,
  opts: SyncOptions = {},
): Promise<SyncSummary> {
  const drafts = toIssueDrafts(report);
  const draftByMarker = new Map(drafts.map((d) => [d.marker, d] as const));

  const existing = await client.listOpenIssues(HANKO_LABEL);
  const existingByMarker = new Map<string, ExistingIssue>();
  for (const issue of existing) {
    const tag = parseMarker(issue.body);
    if (tag !== undefined) existingByMarker.set(markerFor(tag), issue);
  }

  const summary: SyncSummary = { created: 0, updated: 0, closed: 0 };

  // Crear o actualizar por cada componente sin sello.
  for (const draft of drafts) {
    const found = existingByMarker.get(draft.marker);
    if (found === undefined) {
      if (opts.dryRun !== true) await client.createIssue(draft);
      summary.created += 1;
    } else {
      if (opts.dryRun !== true) await client.updateIssue(found.number, draft);
      summary.updated += 1;
    }
  }

  // Cerrar los issues de hanko cuyo componente ya no está sin sello.
  for (const [marker, issue] of existingByMarker) {
    if (!draftByMarker.has(marker)) {
      if (opts.dryRun !== true) await client.closeIssue(issue.number, RESOLVED_COMMENT);
      summary.closed += 1;
    }
  }

  return summary;
}

/* ------------------------------------------------------------------
   Cliente REST real — fetch global (Node 22), cero dependencias.
   ------------------------------------------------------------------ */

export interface RestGithubClientOptions {
  /** Token con permiso `issues: write` (`GITHUB_TOKEN` o un PAT). */
  token: string;
  /** Dueño del repo (`owner` en `owner/repo`). */
  owner: string;
  /** Nombre del repo (`repo` en `owner/repo`). */
  repo: string;
  /** Base de la API; override para tests/GHES. Por defecto la API pública. */
  baseUrl?: string;
}

/** Forma mínima de un issue tal como lo devuelve la REST API. */
interface RawIssue {
  number: number;
  body: string | null;
  /** Presente solo si el «issue» es en realidad un pull request. */
  pull_request?: unknown;
}

export class RestGithubClient implements GithubClient {
  private readonly token: string;
  private readonly owner: string;
  private readonly repo: string;
  private readonly baseUrl: string;

  constructor(opts: RestGithubClientOptions) {
    this.token = opts.token;
    this.owner = opts.owner;
    this.repo = opts.repo;
    this.baseUrl = opts.baseUrl ?? 'https://api.github.com';
  }

  private async request(method: string, path: string, body?: unknown): Promise<Response> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`GitHub API ${method} ${path} → ${res.status} ${res.statusText}: ${text}`);
    }
    return res;
  }

  async listOpenIssues(label: string): Promise<ExistingIssue[]> {
    const out: ExistingIssue[] = [];
    const perPage = 100;
    for (let page = 1; ; page += 1) {
      const q = `state=open&labels=${encodeURIComponent(label)}&per_page=${perPage}&page=${page}`;
      const res = await this.request('GET', `/repos/${this.owner}/${this.repo}/issues?${q}`);
      const items = (await res.json()) as RawIssue[];
      for (const it of items) {
        // El endpoint de issues también devuelve PRs: los descartamos.
        if (it.pull_request !== undefined) continue;
        out.push({ number: it.number, body: it.body ?? '' });
      }
      if (items.length < perPage) break;
    }
    return out;
  }

  async createIssue(draft: IssueDraft): Promise<void> {
    await this.request('POST', `/repos/${this.owner}/${this.repo}/issues`, {
      title: draft.title,
      body: draft.body,
      labels: draft.labels,
    });
  }

  async updateIssue(issueNumber: number, draft: IssueDraft): Promise<void> {
    await this.request('PATCH', `/repos/${this.owner}/${this.repo}/issues/${issueNumber}`, {
      title: draft.title,
      body: draft.body,
      labels: draft.labels,
    });
  }

  async closeIssue(issueNumber: number, comment: string): Promise<void> {
    await this.request('POST', `/repos/${this.owner}/${this.repo}/issues/${issueNumber}/comments`, {
      body: comment,
    });
    await this.request('PATCH', `/repos/${this.owner}/${this.repo}/issues/${issueNumber}`, {
      state: 'closed',
    });
  }
}
