import { describe, it, expect } from 'vitest';
import {
  toIssueDrafts,
  syncGithubIssues,
  parseMarker,
  HANKO_LABEL,
  type GithubClient,
  type ExistingIssue,
  type IssueDraft,
} from './github-issues';
import { buildTrustReport, type ComponentChecks } from './trust-report';
import type { FloorResult } from '../checks/floor';
import type { ContractResult } from '../checks/contract';

const AT = '2026-06-20T00:00:00.000Z';

const floor = (pass: boolean): FloorResult => ({
  tagName: 'lib-x',
  pass,
  violations: pass ? [] : ['sin tagName'],
});

const contract = (pass: boolean): ContractResult => ({
  tagName: 'lib-x',
  level: 'conformance',
  pass,
  violations: pass
    ? []
    : [{ facet: 'method', member: 'reset', message: 'método declarado "reset" ausente' }],
  checked: { registration: true, properties: 1, attributes: 0, methods: 1, reflect: 0, slots: 0 },
  skipped: [],
});

const base = (over: Partial<ComponentChecks> = {}): ComponentChecks => ({
  tagName: 'lib-x',
  source: { kind: 'cem' },
  ...over,
});

/** Cliente fake en memoria: registra las llamadas, sin red. */
class FakeGithubClient implements GithubClient {
  created: IssueDraft[] = [];
  updated: Array<{ number: number; draft: IssueDraft }> = [];
  closed: Array<{ number: number; comment: string }> = [];

  constructor(private open: ExistingIssue[] = []) {}

  async listOpenIssues(_label: string): Promise<ExistingIssue[]> {
    return this.open;
  }
  async createIssue(draft: IssueDraft): Promise<void> {
    this.created.push(draft);
  }
  async updateIssue(issueNumber: number, draft: IssueDraft): Promise<void> {
    this.updated.push({ number: issueNumber, draft });
  }
  async closeIssue(issueNumber: number, comment: string): Promise<void> {
    this.closed.push({ number: issueNumber, comment });
  }
}

describe('toIssueDrafts · mapeo puro', () => {
  it('un borrador por componente sin sello con hallazgos; los sellados se excluyen', () => {
    const report = buildTrustReport(
      [
        base({ tagName: 'lib-ok', floor: floor(true), contract: contract(true) }),
        base({ tagName: 'lib-bad', floor: floor(true), contract: contract(false) }),
      ],
      { generatedAt: AT },
    );
    const drafts = toIssueDrafts(report);
    expect(drafts).toHaveLength(1);
    expect(drafts[0]!.title).toContain('lib-bad');
  });

  it('el cuerpo lleva el marcador estable y todos los findings', () => {
    const report = buildTrustReport(
      [base({ tagName: 'lib-bad', floor: floor(true), contract: contract(false) })],
      { generatedAt: AT },
    );
    const draft = toIssueDrafts(report)[0]!;
    expect(draft.marker).toBe('<!-- hanko:component=lib-bad -->');
    expect(draft.body).toContain(draft.marker);
    expect(parseMarker(draft.body)).toBe('lib-bad');
    // El finding de contrato (prefijado por capa) aparece en el cuerpo.
    expect(draft.body).toContain('contract/method:');
  });

  it('los labels derivan de las capas que fallan', () => {
    const report = buildTrustReport(
      [base({ tagName: 'lib-bad', floor: floor(false), contract: contract(false) })],
      { generatedAt: AT },
    );
    const draft = toIssueDrafts(report)[0]!;
    expect(draft.labels).toContain(HANKO_LABEL);
    expect(draft.labels).toContain('hanko:floor');
    expect(draft.labels).toContain('hanko:contract');
  });
});

describe('syncGithubIssues · diff idempotente', () => {
  const untrusted = () =>
    buildTrustReport(
      [base({ tagName: 'lib-bad', floor: floor(true), contract: contract(false) })],
      { generatedAt: AT },
    );

  it('componente nuevo sin sello → un create', async () => {
    const client = new FakeGithubClient([]);
    const summary = await syncGithubIssues(untrusted(), client);
    expect(summary).toEqual({ created: 1, updated: 0, closed: 0 });
    expect(client.created).toHaveLength(1);
  });

  it('mismo componente en 2ª corrida → update, no duplica', async () => {
    const existing: ExistingIssue = { number: 7, body: '<!-- hanko:component=lib-bad -->\nviejo' };
    const client = new FakeGithubClient([existing]);
    const summary = await syncGithubIssues(untrusted(), client);
    expect(summary).toEqual({ created: 0, updated: 1, closed: 0 });
    expect(client.created).toHaveLength(0);
    expect(client.updated[0]!.number).toBe(7);
  });

  it('componente que vuelve a sellar → se cierra su issue', async () => {
    const sealed = buildTrustReport(
      [base({ tagName: 'lib-bad', floor: floor(true), contract: contract(true) })],
      { generatedAt: AT },
    );
    const existing: ExistingIssue = { number: 9, body: '<!-- hanko:component=lib-bad -->\nviejo' };
    const client = new FakeGithubClient([existing]);
    const summary = await syncGithubIssues(sealed, client);
    expect(summary).toEqual({ created: 0, updated: 0, closed: 1 });
    expect(client.closed[0]!.number).toBe(9);
  });

  it('dry-run no muta nada pero refleja el plan', async () => {
    const client = new FakeGithubClient([]);
    const summary = await syncGithubIssues(untrusted(), client, { dryRun: true });
    expect(summary).toEqual({ created: 1, updated: 0, closed: 0 });
    expect(client.created).toHaveLength(0);
    expect(client.updated).toHaveLength(0);
    expect(client.closed).toHaveLength(0);
  });

  it('ignora issues abiertos sin marcador de hanko', async () => {
    const noise: ExistingIssue = { number: 1, body: 'un issue cualquiera sin marcador' };
    const client = new FakeGithubClient([noise]);
    const summary = await syncGithubIssues(untrusted(), client);
    // El componente sin sello se crea; el issue sin marcador ni se toca ni se cierra.
    expect(summary).toEqual({ created: 1, updated: 0, closed: 0 });
  });
});
