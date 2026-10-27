import EntryRow from './EntryRow.jsx';
import EntryTitle from './EntryTitle.jsx';

export default function WorkEntry({ entry }) {
  return <EntryRow href={`#/experience/${entry.id}`} analyticsId={`work:${entry.id}`}
    id={`work-${entry.id}`} className="work-row" labelledBy={`work-title-${entry.id} work-role-${entry.id}`}>
    <div className="work-row-heading">
      <EntryTitle as="h3" id={`work-title-${entry.id}`} title={entry.organization} logo={entry.logo} logoLoading="lazy" />
      <p className="date">{entry.period}</p>
    </div>
    <p id={`work-role-${entry.id}`} className="work-role">{entry.role}</p>
    <p className="project-summary">{entry.summary}</p>
  </EntryRow>;
}
