import { useEffect, useRef } from 'react';

// The official widget runs only while this popup is open, in its own document.
// No remote Chromium session or API backend is needed for the badge.
export default function LinkedInCard({ href }) {
  const observerRef = useRef(null);
  useEffect(() => () => observerRef.current?.disconnect(), []);
  const vanity = new URL(href).pathname.split('/').filter(Boolean).at(-1);
  return <section className="linkedin-card" aria-label="Official LinkedIn profile card">
    <iframe className="linkedin-card-frame" title="Daniel’s official LinkedIn profile card"
      src={`/linkedin-card.html?profile=${encodeURIComponent(vanity)}`} onLoad={(event) => {
        const frame = event.currentTarget;
        observerRef.current?.disconnect();
        const body = frame.contentDocument?.body;
        if (!body) return;
        const resize = () => { frame.style.height = `${Math.ceil(body.getBoundingClientRect().height) + 2}px`; };
        observerRef.current = new ResizeObserver(resize);
        observerRef.current.observe(body);
        resize();
      }} />
    <div className="browser-toolbar linkedin-card-footer">
      <a className="browser-location" href={href} target="_blank" rel="noopener noreferrer">{new URL(href).hostname + new URL(href).pathname.replace(/\/$/, '')}</a>
    </div>
  </section>;
}
