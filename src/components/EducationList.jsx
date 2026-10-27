import AffiliationSection from './AffiliationSection.jsx';
import EducationEntry from './EducationEntry.jsx';

export default function EducationList({ entries }) {
  return <AffiliationSection id="education" title="Education">
    {entries.map((entry) => <EducationEntry key={entry.id} entry={entry} />)}
    {!entries.length && <p className="empty-state">Education will appear here.</p>}
  </AffiliationSection>;
}
