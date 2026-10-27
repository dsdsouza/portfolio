import AffiliationSection from './AffiliationSection.jsx';
import WorkEntry from './WorkEntry.jsx';

export default function ExperienceList({ entries }) {
  return (
    <div className="experience-list">
      <AffiliationSection id="work" title="Work">
      {!entries.length && <p className="empty-state">Work experience will appear here. Take a look at Projects to see what I’m building.</p>}
      {entries.map((entry) => <WorkEntry key={entry.id} entry={entry} />)}
      </AffiliationSection>

    </div>
  );
}
