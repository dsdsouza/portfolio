// Classify access only after LinkedIn's ordinary redirects have had time to run.
// A 999 page can contain an onload authwall redirect; it isn't the final result.
export function classifyLinkedInAccess({ url, status }) {
  let path;
  try { path = new URL(url).pathname; } catch { return 'denied'; }
  if (/^\/(authwall|login|signup)(\/|$)/.test(path) || /^\/uas\/login/.test(path)) return 'sign-in';
  if (/^\/(checkpoint|challenge)(\/|$)/.test(path)) return 'verification';
  return status >= 400 ? 'denied' : 'public';
}

export async function settleLinkedInRedirect(page, initialStatus) {
  if (initialStatus !== 999) return;
  // Follow the site's own redirect. No user-agent spoofing, cookie injection,
  // challenge solving, or retry loop is involved.
  await page.waitForURL((url) => /^\/(authwall|login|signup|checkpoint|challenge)(\/|$)/.test(url.pathname), {
    waitUntil: 'domcontentloaded', timeout: 4000,
  }).catch(() => {});
}
