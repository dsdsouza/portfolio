import { chromium } from 'playwright';
import { WebSocketServer, WebSocket } from 'ws';
import { profile } from '../src/data/profile.js';
import { classifyLinkedInAccess, settleLinkedInRedirect } from './linkedin-access.mjs';
import { createFrameStream } from './frame-stream.mjs';

const targets = Object.fromEntries(profile.links
  .filter((link) => ['GitHub', 'LinkedIn'].includes(link.label))
  .map((link) => [link.label.toLowerCase(), link.href]));

export function allowedNavigation(value, site) {
  if (!targets[site]) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (site === 'github'
      ? url.hostname === 'github.com'
      : ['linkedin.com', 'www.linkedin.com'].includes(url.hostname));
  } catch { return false; }
}

export function allowedOrigin(origin, host) {
  try {
    const url = new URL(origin);
    return ['localhost', '127.0.0.1'].includes(url.hostname)
      && ['http:', 'https:'].includes(url.protocol) && url.host === host;
  } catch { return false; }
}

const size = (value, min, max, fallback) => Number.isFinite(value)
  ? Math.max(min, Math.min(max, Math.round(value))) : fallback;

// A loopback-only helper for this local portfolio, not a public browser proxy.
export function attachBrowserService(server, { launchBrowser = () => chromium.launch({ headless: true }) } = {}) {
  const wss = new WebSocketServer({ noServer: true, maxPayload: 8192 });
  const sessions = new Set();
  let browserPromise;
  const getBrowser = () => browserPromise ||= launchBrowser().then((browser) => {
    browser.once('disconnected', () => { browserPromise = undefined; });
    return browser;
  }).catch((error) => {
    browserPromise = undefined;
    throw error;
  });

  const onUpgrade = (request, socket, head) => {
    const url = new URL(request.url, 'http://localhost');
    if (url.pathname !== '/api/browser/stream') return;
    const site = url.searchParams.get('site');
    if (!targets[site] || !allowedOrigin(request.headers.origin, request.headers.host) || sessions.size >= 2) {
      socket.end('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n');
      return;
    }
    wss.handleUpgrade(request, socket, head, (ws) => wss.emit('connection', ws, site));
  };
  server.on('upgrade', onUpgrade);

  wss.on('connection', async (ws, site) => {
    sessions.add(ws);
    let context;
    let page;
    let cdp;
    let expiry;
    let queue = Promise.resolve();
    const frames = createFrameStream({
      fps: site === 'github' ? 30 : 12,
      send: (frame) => { if (ws.readyState === WebSocket.OPEN) ws.send(frame); },
      bufferedAmount: () => ws.bufferedAmount,
    });
    const streamOptions = { format: 'jpeg', quality: 80, maxWidth: 1440, maxHeight: 1000 };
    const send = (value) => { if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(value)); };
    const resetExpiry = () => {
      clearTimeout(expiry);
      expiry = setTimeout(() => {
        send({ type: 'status', state: 'error', message: 'This preview timed out. Retry to open a fresh browser.' });
        ws.close();
      }, 10 * 60 * 1000);
      expiry.unref();
    };
    ws.once('close', () => {
      sessions.delete(ws);
      clearTimeout(expiry);
      frames.close();
      context?.close().catch(() => {});
    });
    ws.on('error', () => ws.close());
    ws.on('message', (raw, binary) => {
      if (binary || raw.length > 8192 || !page) return;
      let input;
      try { input = JSON.parse(raw.toString()); } catch { return; }
      resetExpiry();
      queue = queue.then(async () => {
        if (!page || page.isClosed()) return;
        if (input.type === 'visibility' && typeof input.visible === 'boolean' && cdp) {
          if (input.visible) await cdp.send('Page.startScreencast', streamOptions);
          else { frames.clear(); await cdp.send('Page.stopScreencast'); }
        } else if (input.type === 'resize') {
          await page.setViewportSize({ width: size(input.width, 280, 1440, 1000), height: size(input.height, 160, 1000, 600) });
        } else if (input.type === 'click') {
          const viewport = page.viewportSize();
          await page.mouse.click(size(input.x, 0, viewport.width - 1, 0), size(input.y, 0, viewport.height - 1, 0));
        } else if (input.type === 'wheel') {
          await page.mouse.wheel(size(input.dx, -1500, 1500, 0), size(input.dy, -1500, 1500, 0));
        } else if (input.type === 'key' && typeof input.key === 'string' && input.key.length <= 32) {
          const named = { Enter: 'Enter', Backspace: 'Backspace', Delete: 'Delete', ArrowUp: 'ArrowUp', ArrowDown: 'ArrowDown', ArrowLeft: 'ArrowLeft', ArrowRight: 'ArrowRight', PageUp: 'PageUp', PageDown: 'PageDown', Home: 'Home', End: 'End', Tab: 'Tab' };
          if (input.key === ' ') await page.keyboard.press('Space');
          else if (input.key.length === 1 && !input.metaKey && !input.ctrlKey) await page.keyboard.insertText(input.key);
          else if (named[input.key]) await page.keyboard.press(`${input.shiftKey ? 'Shift+' : ''}${named[input.key]}`);
        }
      }).catch(() => send({ type: 'notice', message: 'That action couldn’t finish. Close and reopen the preview, or open the site in your browser.' }));
    });
    send({ type: 'status', state: 'loading', message: 'Opening browser…' });
    resetExpiry();
    try {
      const browser = await getBrowser();
      if (ws.readyState !== WebSocket.OPEN) return;
      context = await browser.newContext({ viewport: { width: 1000, height: 600 }, acceptDownloads: false });
      if (ws.readyState !== WebSocket.OPEN) { await context.close(); return; }
      await context.route('**/*', async (route) => {
        const request = route.request();
        const url = new URL(request.url());
        if (request.isNavigationRequest() && request.frame().parentFrame() === null && !allowedNavigation(url.href, site)) {
          send({ type: 'notice', message: 'That link opens another site. Use Open in browser to continue.' });
          return route.abort();
        }
        if (['localhost', '127.0.0.1', '::1', '[::1]'].includes(url.hostname) || /^(10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/.test(url.hostname)) return route.abort();
        return route.continue();
      });
      page = await context.newPage();
      let navigationStatus = 0;
      page.on('response', (response) => {
        if (response.request().isNavigationRequest() && response.frame() === page.mainFrame()) navigationStatus = response.status();
      });
      page.on('dialog', (dialog) => dialog.dismiss().catch(() => {}));
      context.on('page', async (popup) => {
        if (popup === page) return;
        await popup.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => {});
        const destination = popup.url();
        await popup.close().catch(() => {});
        if (allowedNavigation(destination, site)) await page.goto(destination).catch(() => {});
        else send({ type: 'notice', message: 'Use Open in browser for links to another site.' });
      });
      page.on('framenavigated', (frame) => {
        if (frame === page.mainFrame() && allowedNavigation(frame.url(), site)) send({ type: 'location', url: frame.url() });
      });
      cdp = await context.newCDPSession(page);
      cdp.on('Page.screencastFrame', ({ data, sessionId }) => {
        if (ws.readyState === WebSocket.OPEN) frames.push(Buffer.from(data, 'base64'));
        cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
      });
      await cdp.send('Page.startScreencast', streamOptions);
      send({ type: 'connected' });
      const response = await page.goto(targets[site], { waitUntil: 'domcontentloaded', timeout: 30000 });
      const initialStatus = response?.status() || 0;
      if (site === 'linkedin') await settleLinkedInRedirect(page, initialStatus);
      const finalStatus = navigationStatus || initialStatus;
      const access = site === 'linkedin'
        ? classifyLinkedInAccess({ url: page.url(), status: finalStatus })
        : finalStatus >= 400 ? 'denied' : 'public';
      const finalUrl = new URL(page.url());
      send({ type: 'diagnostic', site, initialStatus, finalStatus, access, path: finalUrl.pathname });
      if (access !== 'public') {
        const message = access === 'sign-in'
          ? 'LinkedIn redirected this request to sign-in. Public visibility settings do not guarantee anonymous access to the full profile.'
          : access === 'verification'
            ? 'LinkedIn requires browser verification. This preview cannot complete that automatically.'
            : `${site === 'linkedin' ? 'LinkedIn' : 'GitHub'} denied this browser request (HTTP ${finalStatus}). You can still open the profile in your browser.`;
        send({ type: 'status', state: 'blocked', reason: access, message });
        ws.close();
      } else send({ type: 'status', state: 'ready', message: '' });
    } catch {
      send({ type: 'status', state: 'error', message: 'The local browser couldn’t open this preview. Retry or open the site in your browser.' });
      ws.close();
    }
  });

  return async () => {
    server.off('upgrade', onUpgrade);
    for (const ws of sessions) ws.terminate();
    wss.close();
    const browser = await browserPromise?.catch(() => null);
    await browser?.close();
  };
}
