import { projectImages } from './projectImages.js';

// Add memories here; array order controls the tab and gallery order.
export const memories = [
  {
    id: 'sbuhacks-2026',
    title: 'SBUHacks 2026',
    thumbnail: { src: '/assets/memories/sbuhacks-2026/sbuhacks-2026-event-logo.png', alt: 'SBUHacks 2026 event logo from Devpost.', width: 300, height: 300 },
    period: 'October 2026',
    description: 'Boilerplate, our 36-hour build, won Best Beginner Track.',
    experience: 'I built Boilerplate with my team at SBUHacks 2026 over 36 hours. We brought coursework, calendars, and AI study planning together in one app, with a browser extension to block distracting websites during focus sessions. At the end of the hackathon, our project won Best Beginner Track in an event with more than 300 participants.',
    photos: [
      { src: '/assets/memories/sbuhacks-2026/boilerplate-award-announcement.webp', width: 1152, height: 1536,
        alt: 'The SBUHacks presentation screen announcing Boilerplate as Beginner Track Winner.',
        caption: 'Boilerplate on the winner announcement screen.' },
      ...projectImages.boilerplate.filter((image) => [
        '/assets/projects/boilerplate/landing-page.jpg',
        '/assets/projects/boilerplate/pip-study-planning.jpg',
        '/assets/projects/boilerplate/teacher-class-workloads.jpg',
      ].includes(image.src)),
    ],
  },
];
