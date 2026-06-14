/* ============================================================
   hanko · Parseo de tipos (CEM type.text → TypeModel)

   Parseo SUPERFICIAL por diseño (ADR-001 / spec data-model):
   primitivos + uniones de literales string, que cubren la
   inmensa mayoría de props de un design system (variant, tone,
   size…). Lo que no se entiende cae a `unknown` con `raw`
   preservado — un parser futuro lo enriquece sin pérdida.

   Spec: docs/specs/ingest.md · docs/specs/data-model.md
   ============================================================ */
import type { TypeModel } from '../core/contract';

export function parseType(raw: string | undefined): TypeModel {
  const text = (raw ?? '').trim();
  if (text === '') return { raw: '', kind: 'unknown' };

  // Primitivos directos.
  if (text === 'boolean') return { raw: text, kind: 'boolean' };
  if (text === 'number') return { raw: text, kind: 'number' };
  if (text === 'string') return { raw: text, kind: 'string' };

  // Unión de varios términos a nivel superior.
  const parts = splitTopLevelUnion(text);
  if (parts.length > 1) {
    const literals = parts
      .map(asStringLiteral)
      .filter((l): l is string => l !== null);
    // Todos los términos son literales string → unión enumerada.
    if (literals.length === parts.length) {
      return { raw: text, kind: 'string-union', literals };
    }
    // Unión mixta/compleja → unknown (pero raw lossless).
    return { raw: text, kind: 'unknown' };
  }

  // Un único término.
  const lit = asStringLiteral(text);
  if (lit !== null) return { raw: text, kind: 'string-union', literals: [lit] };

  if (text.startsWith('{') || text.endsWith('}') || text.startsWith('Record<')) {
    return { raw: text, kind: 'object' };
  }
  return { raw: text, kind: 'unknown' };
}

/** Trocea una unión por `|` de nivel superior, respetando <>, (), [], {} y literales. */
function splitTopLevelUnion(text: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let buf = '';
  let quote: string | null = null;

  for (const ch of text) {
    if (quote !== null) {
      buf += ch;
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      quote = ch;
      buf += ch;
      continue;
    }
    if (ch === '<' || ch === '(' || ch === '[' || ch === '{') depth++;
    else if (ch === '>' || ch === ')' || ch === ']' || ch === '}') depth--;

    if (ch === '|' && depth === 0) {
      parts.push(buf.trim());
      buf = '';
      continue;
    }
    buf += ch;
  }
  const tail = buf.trim();
  if (tail !== '') parts.push(tail);
  return parts;
}

/** Si `part` es un literal string (`'x'` o `"x"`), devuelve su valor; si no, null. */
function asStringLiteral(part: string): string | null {
  const t = part.trim();
  if (t.length < 2) return null;
  const first = t[0];
  const last = t[t.length - 1];
  if ((first === "'" && last === "'") || (first === '"' && last === '"')) {
    return t.slice(1, -1);
  }
  return null;
}
