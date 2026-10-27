import BulletList from './BulletList.jsx';

export default function EntryContent({ location, summary, items = [], sections = [], children }) {
  return <>
    {location && <p className="entry-location">{location}</p>}
    {summary && <p className="experience-description">{summary}</p>}
    <BulletList items={items} />
    {sections.map((section) => <section className="entry-section" key={section.title}>
      <h4>{section.title}</h4>
      {section.text && <p>{section.text}</p>}
      <BulletList items={section.items} />
    </section>)}
    {children}
  </>;
}
