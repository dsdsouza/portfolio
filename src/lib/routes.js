import { portfolioSections } from '../data/navigation.js';

export function parseRoute(hash) {
  const path = hash.replace(/^#/, '');
  if (!path || path === 'main' || path === 'top') return { type: 'projects' };
  if (path === '/resume') return { type: 'resume' }; // Preserve old resume links.
  for (const section of portfolioSections) {
    const base = section.href.slice(1);
    if (path === base) return { type: section.id };
    if (section.detailType && path.startsWith(base + '/')) {
      const slug = path.slice(base.length + 1);
      if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return { type: section.detailType, slug };
    }
  }
  return { type: 'not-found' };
}
