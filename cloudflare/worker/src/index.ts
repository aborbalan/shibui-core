export interface Env {
  ORIGIN: string;
}

interface CacheEntry {
  body: string;
  headers: Record<string, string>;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry>();
const TTL = 3600 * 1000; // 1 hora en ms

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // ── Mutaciones: pasar directo al origin sin cachear ───────────────────
    if (request.method !== 'GET') {
      const originUrl = new URL(url.pathname + url.search, env.ORIGIN);
      return fetch(originUrl.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });
    }

    const cacheKey = url.pathname + url.search;

    // ── Cache HIT ─────────────────────────────────────────────────────────
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < TTL) {
      return new Response(cached.body, {
        headers: { ...cached.headers, 'X-Cache': 'HIT' },
      });
    }

    // ── Cache MISS → fetch al origin ──────────────────────────────────────
    const originUrl = new URL(url.pathname + url.search, env.ORIGIN);
    const originResponse = await fetch(originUrl.toString(), {
      headers: forwardHeaders(request.headers),
    });

    if (!originResponse.ok) {
      return originResponse;
    }

    const body = await originResponse.text();
    const headers = Object.fromEntries(originResponse.headers.entries());

    memoryCache.set(cacheKey, { body, headers, timestamp: Date.now() });

    return new Response(body, {
      status: originResponse.status,
      headers: { ...headers, 'X-Cache': 'MISS' },
    });
  },
};

function forwardHeaders(incoming: Headers): Headers {
  const safe = new Headers();
  const blocked = ['host', 'cf-connecting-ip', 'x-forwarded-for'];
  for (const [key, value] of incoming.entries()) {
    if (!blocked.includes(key.toLowerCase())) {
      safe.set(key, value);
    }
  }
  return safe;
}