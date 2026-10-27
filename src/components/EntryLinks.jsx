import ExternalLink from './ExternalLink.jsx';

export default function EntryLinks({ title, links = [] }) {
  return links?.length > 0 ? <nav className="project-links" aria-label={`${title} links`}>
    {links.map((link) => <ExternalLink key={link.href} href={link.href} className="action-button">{link.label}</ExternalLink>)}
  </nav> : null;
}
