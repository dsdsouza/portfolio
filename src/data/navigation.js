// Tab order, labels, and detail routes live here instead of being repeated in UI.
export const portfolioSections = [
  { id: 'projects', label: 'Projects', href: '#/projects', detailType: 'project', detailKey: 'slug' },
  { id: 'experience', label: 'Work', href: '#/experience', detailType: 'work', detailKey: 'id' },
  { id: 'education', label: 'Education', href: '#/education' },
  { id: 'memories', label: 'Memories', href: '#/memories', detailType: 'memory', detailKey: 'id' },
];
