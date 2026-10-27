import BulletList from './BulletList.jsx';

export default function StorySection({ title, text, items, children, headingAs: Heading = 'h2' }) {
  if (!text && !items?.length && !children) return null;
  return <section className="story-section">
    <Heading>{title}</Heading>
    {children}
    {text && <p>{text}</p>}
    <BulletList className="story-bullets" items={items} />
  </section>;
}
