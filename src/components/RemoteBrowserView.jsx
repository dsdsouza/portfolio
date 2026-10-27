import { useRef, useState } from 'react';
import { useRemoteBrowser } from '../lib/useRemoteBrowser.js';
import ActionButton from './ActionButton.jsx';

export default function RemoteBrowserView({ site, href, label }) {
  const frameRef = useRef(null);
  const imageRef = useRef(null);
  const touchRef = useRef(null);
  const [attempt, setAttempt] = useState(0);
  const { send, painted, location, notice, status } = useRemoteBrowser({ site, href, label, frameRef, imageRef, attempt });

  const unavailable = ['error', 'blocked'].includes(status.state);
  const loading = status.state === 'loading' || (!painted && !unavailable);

  function clickPage(event) {
    if (touchRef.current?.moved) { touchRef.current = null; return; }
    const image = frameRef.current.querySelector('img');
    if (!image?.naturalWidth) return;
    frameRef.current.focus({ preventScroll: true });
    const rect = image.getBoundingClientRect();
    const scale = Math.min(rect.width / image.naturalWidth, rect.height / image.naturalHeight);
    const x = (event.clientX - rect.left - (rect.width - image.naturalWidth * scale) / 2) / scale;
    const y = (event.clientY - rect.top - (rect.height - image.naturalHeight * scale) / 2) / scale;
    if (x >= 0 && y >= 0 && x < image.naturalWidth && y < image.naturalHeight) send({ type: 'click', x, y });
  }

  return (
    <section aria-label={`${label} live preview`}>
      {unavailable && <div className="browser-message" role="alert"><p>{status.message}</p><button type="button" className="text-button" onClick={() => setAttempt((value) => value + 1)}>Retry preview</button></div>}
      <div ref={frameRef} className={`browser-frame${unavailable ? ' browser-frame--unavailable' : ''}`} role="region" tabIndex={0} aria-label={`Interactive ${label} browser. Click and scroll to explore; Escape closes the preview.`} aria-busy={loading} onClick={clickPage} onKeyDown={(event) => {
        if (['Escape', 'Tab'].includes(event.key) || event.ctrlKey || event.metaKey) return;
        event.preventDefault();
        send({ type: 'key', key: event.key, shiftKey: event.shiftKey });
      }} onPointerDown={(event) => {
        if (event.pointerType === 'touch') { touchRef.current = { y: event.clientY, start: event.clientY, moved: false }; event.currentTarget.setPointerCapture(event.pointerId); }
      }} onPointerMove={(event) => {
        const touch = touchRef.current;
        if (event.pointerType !== 'touch' || !touch) return;
        if (Math.abs(event.clientY - touch.start) > 6) touch.moved = true;
        if (touch.moved) send({ type: 'wheel', dx: 0, dy: touch.y - event.clientY });
        touch.y = event.clientY;
      }} onPointerUp={(event) => { if (event.pointerType === 'touch' && !touchRef.current?.moved) touchRef.current = null; }} onPointerCancel={() => { touchRef.current = null; }}>
        {/* The hook assigns a decoded blob URL before revealing the first frame. */}
        <img ref={imageRef} alt={`Live ${label} page`} draggable="false" hidden={!painted} />
        {loading && <div className="browser-loading" role="status">Opening {label}…</div>}
      </div>
      {notice && <p className="browser-notice" role="status">{notice}</p>}
      <div className="browser-toolbar">
        <ActionButton onClick={() => window.open(unavailable ? href : location, '_blank', 'noopener,noreferrer')}>Open in browser</ActionButton>
        <p className="browser-location">{(() => { const url = new URL(unavailable ? href : location); return url.hostname + url.pathname; })()}</p>
      </div>
    </section>
  );
}
