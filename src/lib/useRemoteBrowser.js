import { useCallback, useEffect, useRef, useState } from 'react';

export function useRemoteBrowser({ site, href, label, frameRef, imageRef, attempt }) {
  const sender = useRef(() => {});
  const send = useCallback((value) => sender.current(value), []);
  const [painted, setPainted] = useState(false);
  const [location, setLocation] = useState(href);
  const [notice, setNotice] = useState('');
  const [status, setStatus] = useState({ state: 'loading', message: `Opening ${label}…` });

  useEffect(() => {
    let disposed = false;
    let connected = false;
    let socket;
    let latest;
    let decoding = false;
    let paintTask;
    let wheelTask;
    let resizeTimer;
    let currentUrl;
    let didPaint = false;
    let lastSize;
    let dx = 0;
    let dy = 0;
    const urls = new Set();
    setPainted(false);
    setNotice('');
    setStatus({ state: 'loading', message: `Opening ${label}…` });
    setLocation(href);
    imageRef.current.removeAttribute('src');
    const transmit = (value) => {
      if (connected && socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify(value));
    };
    sender.current = transmit;

    async function paint() {
      paintTask = undefined;
      if (disposed || decoding || !latest) return;
      decoding = true;
      const blob = latest;
      latest = undefined;
      const url = URL.createObjectURL(blob);
      urls.add(url);
      try {
        const image = new Image();
        image.src = url;
        await image.decode();
        if (!disposed) {
          imageRef.current.src = url;
          if (currentUrl) { URL.revokeObjectURL(currentUrl); urls.delete(currentUrl); }
          currentUrl = url;
          if (!didPaint) { didPaint = true; setPainted(true); }
        }
      } catch { URL.revokeObjectURL(url); urls.delete(url); }
      finally {
        decoding = false;
        if (!disposed && latest) paintTask = requestAnimationFrame(paint);
      }
    }
    function resize() {
      const width = frameRef.current.clientWidth;
      const height = frameRef.current.clientHeight;
      const key = `${width}x${height}`;
      if (width && height && key !== lastSize) { lastSize = key; transmit({ type: 'resize', width, height }); }
    }
    const observer = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 100);
    });
    const target = frameRef.current;
    observer.observe(target);
    function wheel(event) {
      event.preventDefault();
      const factor = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? target.clientHeight : 1;
      dx += event.deltaX * factor;
      dy += event.deltaY * factor;
      if (!wheelTask) wheelTask = requestAnimationFrame(() => {
        transmit({ type: 'wheel', dx, dy }); dx = 0; dy = 0; wheelTask = undefined;
      });
    }
    const visibility = () => transmit({ type: 'visibility', visible: document.visibilityState === 'visible' });
    target.addEventListener('wheel', wheel, { passive: false });
    document.addEventListener('visibilitychange', visibility);

    // Defer connection so StrictMode's abandoned setup never launches a browser.
    queueMicrotask(() => {
      if (disposed) return;
      socket = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/browser/stream?site=${encodeURIComponent(site)}`);
      socket.onmessage = (event) => {
        if (disposed) return;
        if (typeof event.data !== 'string') {
          latest = event.data;
          if (!paintTask && !decoding) paintTask = requestAnimationFrame(paint);
          return;
        }
        const packet = JSON.parse(event.data);
        if (packet.type === 'connected') { connected = true; resize(); }
        if (packet.type === 'status') setStatus(packet);
        if (packet.type === 'location') setLocation(packet.url);
        if (packet.type === 'notice') setNotice(packet.message);
      };
      socket.onerror = () => { if (!disposed) setStatus({ state: 'error', message: 'The local browser is unavailable. Retry or open the site in your browser.' }); };
      socket.onclose = () => {
        if (!disposed) setStatus((previous) => ['blocked', 'error'].includes(previous.state) ? previous : { state: 'error', message: 'The preview disconnected. Retry to open a fresh browser.' });
      };
    });
    return () => {
      disposed = true;
      observer.disconnect();
      clearTimeout(resizeTimer);
      cancelAnimationFrame(paintTask);
      cancelAnimationFrame(wheelTask);
      target.removeEventListener('wheel', wheel);
      document.removeEventListener('visibilitychange', visibility);
      socket?.close();
      latest = undefined;
      for (const url of urls) URL.revokeObjectURL(url);
    };
  }, [site, href, label, frameRef, imageRef, attempt]);
  return { send, painted, location, notice, status };
}
