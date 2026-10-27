import EntryTitle from './EntryTitle.jsx';
import BackLink from './BackLink.jsx';

export default function DetailPage({ title, logo, headingRef, backHref, backLabel, className = '', children }) {
  return <article className={`project-detail${className ? ` ${className}` : ''}`}>
    <BackLink href={backHref}>{backLabel}</BackLink>
    <EntryTitle as="h1" title={title} logo={logo} headingRef={headingRef} tabIndex={-1} />
    {children}
  </article>;
}
