import { useEffect, useRef } from 'react';
import { analyticsTargets } from './analytics-catalog.js';
import { createVisitClock } from './analytics-clock.js';

export function useAnalytics(route, viewer) {
  const tracker = useRef(null);
  const context = useRef({ route, viewer });
  context.current = { route, viewer };
  useEffect(() => {
    // Production only by default. No cookies, storage, external SDK, or heartbeat.
    if ((!import.meta.env.PROD && import.meta.env.VITE_ANALYTICS !== 'true') ||
      navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true) return;
    const clock = createVisitClock({ id: crypto.randomUUID(), startedAt: Date.now() });
    const inView = new Set();
    let lastPayload = '';
    let paused = false;
    function update() {
      const { route: current, viewer: modal } = context.current;
      const routeTarget = current.type === 'project' ? `project:${current.slug}` : current.type === 'work' ? `work-detail:${current.slug}` : current.type === 'memory' ? `memory-detail:${current.slug}` : `page:${current.type}`;
      const keys = modal ? [`viewer:${modal}`] : [routeTarget, ...[...inView]
        .filter((element) => element.isConnected && !element.closest('[hidden]'))
        .map((element) => element.dataset.analytics)];
      clock.setTargets(keys.filter((key) => analyticsTargets.has(key)), !paused && document.visibilityState === 'visible');
    }
    function flush() {
      const snapshot = clock.snapshot();
      const signature = JSON.stringify({ ...snapshot, sequence: 0 });
      if (signature === lastPayload || snapshot.visibleMs < 1000) return;
      const body = JSON.stringify(snapshot);
      if (new Blob([body]).size > 32768) return;
      // A failed beacon can use keepalive; no automatic polling/retry traffic.
      if (!navigator.sendBeacon?.('/api/analytics', new Blob([body], { type: 'application/json' }))) {
        void fetch('/api/analytics', { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true, credentials: 'omit' }).catch(() => {});
      }
      lastPayload = signature;
    }
    function visibility() { update(); if (document.visibilityState === 'hidden') flush(); }
    function pagehide() { paused = true; update(); flush(); }
    function pageshow() { paused = false; update(); }
    const observed = new WeakSet();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) inView.add(entry.target);
        else inView.delete(entry.target);
      }
      update();
    }, { threshold: [0, 0.25] });
    function scan() {
      for (const element of document.querySelectorAll('[data-analytics]')) if (!observed.has(element)) {
        observed.add(element); observer.observe(element);
      }
      for (const element of inView) if (!element.isConnected) inView.delete(element);
      update();
    }
    const mutations = new MutationObserver(scan);
    mutations.observe(document.getElementById('root'), { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden'] });
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('pagehide', pagehide);
    window.addEventListener('pageshow', pageshow);
    tracker.current = update;
    scan();
    return () => {
      observer.disconnect(); mutations.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('pagehide', pagehide);
      window.removeEventListener('pageshow', pageshow);
      tracker.current = null;
    };
  }, []);
  useEffect(() => { tracker.current?.(); }, [route.type, route.slug, viewer]);
}
