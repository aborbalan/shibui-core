/* ============================================================
   kura · presentación

   Tres formatos, una regla: el formato por defecto lo decide el
   destino, no un flag. Con TTY delante hay un humano y se pinta
   una tabla; sin TTY hay una tubería o un agente y se emite
   NDJSON.

   NDJSON emite UN SOBRE POR FILA en vez de un sobre con un array
   dentro. Es más verboso, pero es lo que hace que un listado que
   falla a la mitad siga siendo legible: las filas ya emitidas son
   válidas y el error llega como una línea más.
   ============================================================ */
import type { Envelope } from './envelope';

export const FORMATS = ['table', 'json', 'ndjson'] as const;
export type Format = (typeof FORMATS)[number];

export function isFormat(value: string): value is Format {
  return (FORMATS as readonly string[]).includes(value);
}

export function defaultFormat(isTTY: boolean): Format {
  return isTTY ? 'table' : 'ndjson';
}

export function render(envelope: Envelope<unknown>, format: Format): string {
  switch (format) {
    case 'json':
      return JSON.stringify(envelope, null, 2);
    case 'ndjson':
      return renderNdjson(envelope);
    case 'table':
      return renderTable(envelope);
  }
}

function renderNdjson(envelope: Envelope<unknown>): string {
  if (!envelope.ok) return JSON.stringify(envelope);
  const { data } = envelope;
  if (!Array.isArray(data)) return JSON.stringify(envelope);
  return data.map((item: unknown) => JSON.stringify({ ok: true, data: item })).join('\n');
}

function renderTable(envelope: Envelope<unknown>): string {
  if (!envelope.ok) {
    const { code, message, hint } = envelope.error;
    return hint === undefined ? `${code}: ${message}` : `${code}: ${message}\n  ${hint}`;
  }

  const rows = asRecordRows(envelope.data);
  if (rows === null) return JSON.stringify(envelope.data, null, 2);
  if (rows.length === 0) return '(sin resultados)';

  const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  const widths = columns.map((column) =>
    Math.max(column.length, ...rows.map((row) => cell(row[column]).length)),
  );

  const line = (cells: readonly string[]): string =>
    cells.map((value, i) => value.padEnd(widths[i] ?? 0)).join('  ').trimEnd();

  return [
    line(columns),
    line(widths.map((width) => '─'.repeat(width))),
    ...rows.map((row) => line(columns.map((column) => cell(row[column])))),
  ].join('\n');
}

/** Solo se tabula un array homogéneo de objetos planos; lo demás cae a JSON. */
function asRecordRows(data: unknown): ReadonlyArray<Record<string, unknown>> | null {
  if (!Array.isArray(data)) return null;
  const rows: Record<string, unknown>[] = [];
  for (const item of data as unknown[]) {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) return null;
    rows.push(item as Record<string, unknown>);
  }
  return rows;
}

function cell(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'sí' : 'no';
  if (Array.isArray(value)) return (value as unknown[]).map(cell).join(', ');
  return String(value);
}
