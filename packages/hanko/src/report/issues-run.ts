/* ============================================================
   hanko · runner del emisor de issues (opt-in)

   Entrada OPT-IN: no forma parte del pipeline por defecto
   (`report` / `report:full` no lo invocan). Lee el `trust-report.json`
   que `report` ya dejó (no recalcula nada) y sincroniza issues de
   GitHub —uno por componente sin sello— de forma idempotente.

   Uso:
     pnpm --filter @shibui-ui/hanko issues                  # rutas por defecto
     pnpm --filter @shibui-ui/hanko issues --dry-run        # ensayo sin red
     pnpm --filter @shibui-ui/hanko issues [report.json] [--repo owner/name]

   Entorno:
     GITHUB_TOKEN       obligatorio salvo --dry-run (permiso issues: write).
     GITHUB_REPOSITORY  "owner/repo" (lo expone GitHub Actions); --repo lo override.

   Spec: docs/specs/github-issues.md
   ============================================================ */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { TrustReport } from './trust-report';
import { RestGithubClient, syncGithubIssues } from './github-issues';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

const repoFlagIdx = args.indexOf('--repo');
const repoFlag = repoFlagIdx !== -1 ? args[repoFlagIdx + 1] : undefined;

// Primer posicional que no sea flag ni valor de --repo → ruta al trust-report.json.
const repoValueIdx = repoFlagIdx !== -1 ? repoFlagIdx + 1 : -1;
const positionals = args.filter((a, i) => !a.startsWith('--') && i !== repoValueIdx);
const reportPath = positionals[0] ?? join('hanko-report', 'trust-report.json');

function loadReport(p: string): TrustReport {
  try {
    return JSON.parse(readFileSync(p, 'utf-8')) as TrustReport;
  } catch (err) {
    console.error(`hanko issues · no pude leer/parsear el Trust Report en "${p}":`);
    console.error(String(err));
    process.exit(2);
  }
}

function resolveRepo(): { owner: string; repo: string } {
  const slug = repoFlag ?? process.env.GITHUB_REPOSITORY;
  if (slug === undefined || !slug.includes('/')) {
    console.error('hanko issues · falta el repo. Pásalo con --repo owner/name o GITHUB_REPOSITORY.');
    process.exit(2);
  }
  const [owner, repo] = slug.split('/');
  return { owner: owner!, repo: repo! };
}

async function main(): Promise<void> {
  const report = loadReport(reportPath);

  if (dryRun) {
    // Ensayo: calcula el plan sin cliente real (no se llama a la API).
    const noop = {
      listOpenIssues: async () => [],
      createIssue: async () => undefined,
      updateIssue: async () => undefined,
      closeIssue: async () => undefined,
    };
    const summary = await syncGithubIssues(report, noop, { dryRun: true });
    console.log(
      `hanko issues · [dry-run] ${report.untrusted} sin sello → ` +
        `${summary.created} a crear · ${summary.updated} a actualizar · ${summary.closed} a cerrar`,
    );
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  if (token === undefined || token === '') {
    console.error('hanko issues · falta GITHUB_TOKEN (permiso issues: write). Aborto.');
    process.exit(2);
  }

  const { owner, repo } = resolveRepo();
  const client = new RestGithubClient({ token, owner, repo });
  const summary = await syncGithubIssues(report, client);
  console.log(
    `hanko issues · ${owner}/${repo} → ` +
      `${summary.created} creados · ${summary.updated} actualizados · ${summary.closed} cerrados`,
  );
}

main().catch((err: unknown) => {
  console.error('hanko issues · fallo inesperado:');
  console.error(String(err));
  process.exit(1);
});
