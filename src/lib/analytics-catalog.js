import { memories } from '../data/memories.js';
import { projects } from '../data/projects.js';
import { experience } from '../data/experience.js';
import { education } from '../data/education.js';

// Shared by the collector and browser. New content is included automatically.
export const analyticsTargets = new Set([
  'page:memories',
  ...memories.flatMap(({ id }) => [`memory:${id}`, `memory-detail:${id}`, `viewer:memory:${id}`]),
  'page:projects', 'page:experience', 'page:education', 'section:about', 'section:work', 'section:education',
  'viewer:resume', 'viewer:github', 'viewer:linkedin',
  ...projects.flatMap(({ slug }) => [`project-card:${slug}`, `project:${slug}`]),
  ...experience.flatMap(({ id, aliases = [] }) => [`work:${id}`, `work-detail:${id}`, ...aliases.map((alias) => `work-detail:${alias}`)]),
  ...education.map(({ id }) => `education:${id}`),
]);
