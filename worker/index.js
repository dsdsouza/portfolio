import { analyticsTargets } from '../src/lib/analytics-catalog.js';
const LIMIT = 32768;
const MAX_TIME = 7 * 24 * 60 * 60 * 1000;
const integer = (value, max) => Number.isSafeInteger(value) && value >= 0 && value <= max;
export function validSnapshot(value, now = Date.now()) {
  return value?.v === 1 && typeof value.id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.id) &&
    integer(value.sequence, 100000) && value.sequence > 0 && integer(value.startedAt, now + 60000) && value.startedAt >= now - MAX_TIME &&
    integer(value.visibleMs, MAX_TIME) && value.visibleMs <= now - value.startedAt + 60000 &&
    Array.isArray(value.targets) && value.targets.length <= analyticsTargets.size &&
    new Set(value.targets.map((entry) => entry?.id)).size === value.targets.length &&
    value.targets.every((entry) => analyticsTargets.has(entry?.id) && integer(entry.ms, value.visibleMs) && integer(entry.views, 100000));
}
async function readLimited(request) {
  if (Number(request.headers.get('content-length')) > LIMIT) throw new Error('size');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('body');
  const chunks = []; let length = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > LIMIT) { await reader.cancel(); throw new Error('size'); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(bytes));
}
/** @type {ExportedHandler<Env>} */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/analytics') return env.ASSETS.fetch(request);
    const respond = (status) => new Response(null, { status, headers: { 'Cache-Control': 'no-store' } });
    if (request.method !== 'POST') return respond(405);
    if (request.headers.get('origin') !== url.origin || request.headers.get('sec-fetch-site') === 'cross-site') return respond(403);
    if (request.headers.get('sec-gpc') === '1' || request.headers.get('dnt') === '1') return respond(204);
    if (!request.headers.get('content-type')?.startsWith('application/json')) return respond(415);
    let data;
    try { data = await readLimited(request); } catch { return respond(400); }
    if (!validSnapshot(data)) return respond(400);
    try {
      // One write per batch; cumulative data replaces older snapshots atomically.
      await env.ANALYTICS.prepare(`INSERT INTO visits (id, sequence, started_at, received_at, visible_ms, targets)
        VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET
        sequence=excluded.sequence, received_at=excluded.received_at,
        visible_ms=excluded.visible_ms, targets=excluded.targets
        WHERE excluded.sequence > visits.sequence AND excluded.started_at = visits.started_at`)
        .bind(data.id, data.sequence, data.startedAt, Date.now(), data.visibleMs,
          JSON.stringify(data.targets.map(({ id, ms, views }) => ({ id, ms, views })))).run();
      return respond(204);
    } catch { console.error('Analytics database write failed'); return respond(503); }
  },
};
