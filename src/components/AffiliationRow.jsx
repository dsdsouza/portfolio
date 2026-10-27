import ExternalLink from './ExternalLink.jsx';
import { EntryLogo } from './EntryTitle.jsx';

export default function AffiliationRow({ name, website, logo, period, note }) {
  return (
    <div className="affiliation-row">
      {logo ? <EntryLogo src={logo} className="organization-logo" loading="lazy" /> : <span aria-hidden="true" />}
      <h3 className="affiliation-name">
        <ExternalLink href={website}>{name}</ExternalLink>
        {note && <span className="affiliation-note"> · {note}</span>}
      </h3>
      <p className="affiliation-period date">{period}</p>
    </div>
  );
}
