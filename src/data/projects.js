import { projectImages } from './projectImages.js';

// Display order follows this array. Every entry gets its own page automatically.
// See README.md for the fields and a copyable entry.
// technologies is the complete filter-ready stack: one component per string.
// Reuse exact names across entries so future filters can use includes(name).
export const projects = [
  {
    slug: 'boilerplate',
    images: projectImages['boilerplate'],
    title: 'Boilerplate',
    logo: '/assets/projects/boilerplate/boilerplate-icon.png',
    organization: 'SBUHacks 2026',
    category: 'Full-stack development · AI',
    role: 'Hackathon team member',
    period: 'October 2026',
    recognition: 'Won Best Beginner Track',
    summary: 'Coursework, workload forecasts, and AI study planning in one place. Built and deployed with a team in 36 hours.',
    overview: 'Boilerplate brings coursework and calendars together to help students understand their workload, plan study time, and stay focused. An animated boiler makes a growing workload visible, and a seven-day forecast helps students anticipate busy periods.',
    contribution: 'Built a full-stack application with Next.js, React, TypeScript, Supabase, and Gemini, integrating coursework and calendars with workload forecasts, AI study planning, and a browser extension that blocks distracting websites.',
    outcome: 'Our team received the Best Beginner Track award at SBUHacks 2026. We designed and deployed Boilerplate within 36 hours at an event with 300+ participants and $3,000+ in total prizes.',
    work: [
      'Combined coursework deadlines and calendar events into a seven-day workload estimate. Students can mark tasks complete and see which assignments and meetings contribute to each day.',
      'Connected Gemini to assignment context and available calendar windows so Pip can suggest a next task or study session. Students review each suggested session before adding it to their schedule.',
      'Built a browser extension that blocks distracting websites during focus sessions, and a teacher view that previews how a new assignment affects class workloads while respecting student sharing settings.',
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'Gemini', 'Cloudflare'],
    links: [
      { label: 'Devpost', href: 'https://devpost.com/software/boilerplate-3mxhbv' },
      { label: 'Source code', href: 'https://github.com/dsdsouza/Boilerplate' },
      { label: 'Live demo', href: 'https://boilerplate.select/' },
    ],
  },
  {
    slug: 'volunteer-management',
    images: projectImages['volunteer-management'],
    title: 'Volunteer Management System',
    logo: '/assets/organizations/rewild-long-island-logo.webp',
    category: 'Full-stack development',
    organization: 'ReWild Long Island',
    role: 'Software Development Intern · Full Stack Web Dev Team',
    period: 'Sep 2025 – Aug 2026',
    summary: 'Led a small team building a platform for volunteer and intern operations at ReWild Long Island.',
    overview: 'A secure platform for the people coordinating community environmental work, bringing scheduling, location tracking, and user profiles into one system.',
    contribution: 'I led a small development team building the platform, coordinated its frontend deployment and backend migration, and automated administrative workflows.',
    work: [
      'Built volunteer and intern accounts with JWT authentication using Node.js, TypeScript, JavaScript, and Python.',
      'Deployed the frontend to Vercel and migrated the backend from Cloudflare to Google Cloud Platform, connecting the two through REST APIs.',
      'Used PostgreSQL, PowerShell, and Git to support scheduling, location tracking, and user profiles. The platform includes validated volunteer hours, event registrations, waitlists, and searchable chapter teams.',
    ],
    technologies: ['Node.js', 'TypeScript', 'JavaScript', 'Python', 'PostgreSQL', 'JWT', 'PowerShell', 'Git', 'Vercel', 'Cloudflare', 'Google Cloud Platform'],
  },
  {
    slug: 'sustainable-landcare',
    images: projectImages['sustainable-landcare'],
    title: 'Sustainable Landcare Hub',
    logo: '/assets/organizations/rewild-long-island-logo.webp',
    category: 'Conversational AI',
    organization: 'ReWild Long Island',
    role: 'Software Development Intern · AI Team',
    period: 'Aug 2026 – Present',
    summary: 'Multilingual conversational AI for locally grounded native plant guidance.',
    overview: 'A conversational platform that helps people find native plant guidance and participate in community ecological action, with a multilingual web interface and contextual knowledge retrieval.',
    contribution: 'I’m developing the conversational AI platform and the backend systems that connect questions with relevant landcare knowledge.',
    work: [
      'Developing multilingual native-plant guidance with containerized Gemma models and Hugging Face BGE-M3 embeddings.',
      'Designing PostgreSQL tables with pgvector to retrieve relevant landcare information through vector similarity search across partner nonprofit resources.',
      'Building Python and TypeScript REST services, packaging them in Docker containers, and deploying them on Google Cloud Platform.',
    ],
    technologies: ['Python', 'TypeScript', 'PostgreSQL', 'pgvector', 'Docker', 'Google Cloud Platform', 'Gemma', 'Hugging Face BGE-M3'],
  },
];
