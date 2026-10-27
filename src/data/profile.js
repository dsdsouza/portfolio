// Edit the profile and links here; the layout does not contain personal copy.
const emails = [
  { label: 'Personal', address: 'danielsethdsouza@gmail.com' },
  { label: 'University', address: 'daniel.dsouza@stonybrook.edu', mobilePrimary: true },
];

export const profile = {
  emails,
  name: 'Daniel D’Souza',
  introduction: 'CS Honors @ Stony Brook University',
  location: 'New York',
  experienceSummary: 'Interning @ ReWild Long Island',
  about: "I am an undergraduate at Stony Brook University and a software engineer specializing in full-stack development, cloud infrastructure, and practical AI systems. I have architected multilingual conversational AI tools using containerized Gemma models and RAG via pgvector, led development teams to build volunteer management platforms on Google Cloud Platform, and refactored legacy enterprise software to meet Department of Defense cybersecurity mandates for contracting. I work primarily with TypeScript, JavaScript, Python, and Java. I'm always open to talking about math (or other cool things)!",
  portrait: { src: '/assets/portraits/daniel-dsouza-linkedin.jpg', alt: 'Daniel D’Souza', width: 400, height: 400 },
  resume: "/assets/documents/Daniel%20D%27Souza%20Resume.pdf",
  links: [
    { label: 'Resume', href: '#/resume', viewer: 'resume' },
    { label: 'Email', href: `mailto:${emails[0].address}` },
    { label: 'GitHub', href: 'https://github.com/dsdsouza', viewer: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/danielsdsouza/', viewer: 'linkedin' },
  ],
};
