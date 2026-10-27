import StorySections from './StorySections.jsx';
import DetailPage from './DetailPage.jsx';
import StorySection from './StorySection.jsx';
import EntryLinks from './EntryLinks.jsx';

function PositionMeta({ role, location, period }) {
  return <div className="position-meta">
    <p className="detail-meta">{role}</p>
    {location && <p className="detail-meta">{location}</p>}
    <p className="detail-meta">{period}</p>
  </div>;
}

function RoleDetails({ role, grouped = false }) {
  const headingAs = grouped ? 'h3' : 'h2';
  return <>
    <StorySection headingAs={headingAs} title="What I did" items={role.details} />
    <StorySection headingAs={headingAs} title="Leadership" items={role.leadership} />
    <StorySection headingAs={headingAs} title="Skills learned" items={role.skills} />
    <StorySection headingAs={headingAs} title="Built with" items={role.technologies} />
    <StorySections headingAs={headingAs} sections={role.sections} />
  </>;
}

export default function WorkDetails({ entry, headingRef }) {
  return <DetailPage title={entry.organization} logo={entry.logo} headingRef={headingRef}
    backHref="#/experience" backLabel="Back to work" className="work-detail">
    <PositionMeta role={entry.role} location={entry.location} period={entry.period} />
    <p className="detail-overview">{entry.summary}</p>
    <EntryLinks title={entry.organization} links={entry.website ? [{ href: entry.website, label: 'Company website' }] : []} />
    {entry.roles?.length ? entry.roles.map((role) => <section className="work-team" key={role.id}>
      <h2>{role.title}</h2>
      <PositionMeta role={role.role || entry.role} location={role.location || entry.location} period={role.period} />
      <p className="detail-overview">{role.summary}</p>
      <RoleDetails role={role} grouped />
    </section>) : <RoleDetails role={entry} />}
  </DetailPage>;
}
