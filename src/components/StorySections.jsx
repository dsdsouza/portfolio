import StorySection from './StorySection.jsx';

// Extra sections are content data: no page component edits are needed.
export default function StorySections({ sections = [], headingAs = 'h2' }) {
  return sections.map((section) => <StorySection key={section.title} headingAs={headingAs}
    title={section.title} text={section.text} items={section.items} />);
}
