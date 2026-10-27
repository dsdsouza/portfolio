// Cumulative snapshots make retries and out-of-order delivery safe.
export function createVisitClock({ id, startedAt, now = () => performance.now() }) {
  const entries = new Map();
  let active = new Set();
  let visible = false;
  let last = now();
  let visibleMs = 0;
  let sequence = 0;
  function settle() {
    const time = now();
    const elapsed = Math.max(0, time - last);
    if (visible) {
      visibleMs += elapsed;
      for (const key of active) entries.get(key).ms += elapsed;
    }
    last = time;
  }
  return {
    setTargets(targets, isVisible) {
      settle();
      const next = new Set(targets);
      if (isVisible) for (const key of next) {
        if (!entries.has(key)) entries.set(key, { id: key, ms: 0, views: 0 });
        // A view is a viewport entry, route entry, or return from background.
        if (!visible || !active.has(key)) entries.get(key).views++;
      }
      active = next;
      visible = isVisible;
    },
    snapshot() {
      settle();
      return { v: 1, id, startedAt, sequence: ++sequence, visibleMs: Math.round(visibleMs),
        targets: [...entries.values()].map((entry) => ({ ...entry, ms: Math.round(entry.ms) })) };
    },
  };
}
