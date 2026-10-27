import AffiliationRow from './AffiliationRow.jsx';
import EntryContent from './EntryContent.jsx';

export default function EducationEntry({ entry }) {
  const hasDetails = entry.summary || entry.details?.length || entry.sections?.length;
  const facts = [...(entry.degree ? [{ label: 'Degree', value: entry.degree }] : []), ...(entry.facts || [])];
  return <article data-analytics={`education:${entry.id}`} className="education-entry">
    <AffiliationRow name={entry.school} website={entry.website} logo={entry.logo} period={entry.period} />
    {facts.length > 0 && <dl className="entry-facts">
      {facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
    </dl>}
    {hasDetails && <details className="experience-details education-details">
      <summary>{entry.detailsLabel || 'More about this education'}<span className="sr-only"> at {entry.school}</span></summary>
      <EntryContent summary={entry.summary} items={entry.details} sections={entry.sections} />
    </details>}
  </article>;
}
