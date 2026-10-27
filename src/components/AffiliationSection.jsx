export default function AffiliationSection({ id, title, children, className = '' }) {
  return <section className={`affiliation-section ${className}`} aria-label={title} data-analytics={`section:${id}`}>
    {children}
  </section>;
}
