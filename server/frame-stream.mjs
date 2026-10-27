// Keep only the newest frame; never build a backlog of stale screenshots.
export function createFrameStream({ send, bufferedAmount = () => 0, fps = 12, maxBufferedBytes = 256 * 1024, now = () => performance.now(), schedule = setTimeout, cancel = clearTimeout }) {
  const interval = 1000 / fps;
  let latest;
  let timer;
  let lastSent = -Infinity;
  let closed = false;
  function flush() {
    timer = undefined;
    if (closed || !latest) return;
    if (bufferedAmount() > maxBufferedBytes) { timer = schedule(flush, interval); return; }
    const wait = interval - (now() - lastSent);
    if (wait > 0) { timer = schedule(flush, wait); return; }
    const frame = latest;
    latest = undefined;
    lastSent = now();
    send(frame);
  }
  function clear() { cancel(timer); timer = undefined; latest = undefined; }
  return {
    push(frame) { if (closed) return; latest = frame; if (!timer) flush(); },
    clear,
    close() { closed = true; clear(); },
  };
}
