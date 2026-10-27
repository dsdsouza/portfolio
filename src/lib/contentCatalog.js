import { projects } from '../data/projects.js';
import { experience } from '../data/experience.js';
import { education } from '../data/education.js';
import { memories } from '../data/memories.js';
import { portfolioSections } from '../data/navigation.js';

export const content = { projects, experience, education, memories };
const indexes = new Map(portfolioSections.filter((section) => section.detailType).map((section) => [
  section.detailType,
  new Map(content[section.id].flatMap((entry) => [entry[section.detailKey], ...(entry.aliases || [])].map((key) => [key, entry]))),
]));

export function resolveRoute(route) {
  const section = portfolioSections.find((section) => section.id === route.type || section.detailType === route.type) || portfolioSections[0];
  const isDetail = indexes.has(route.type);
  const entry = isDetail ? indexes.get(route.type).get(route.slug) : null;
  const notFound = route.type === 'not-found' || (isDetail && !entry);
  const title = notFound ? 'Page not found' : entry
    ? route.type === 'work' ? `${entry.organization} — ${entry.role}` : entry.title
    : section.id === 'projects' ? 'Portfolio' : section.label;
  return { section, entry, notFound, detailView: isDetail || notFound, title };
}
