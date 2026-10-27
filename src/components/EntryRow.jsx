// Shared clickable index row. Content stays composed by each entry type.
export default function EntryRow({ href, analyticsId, id, labelledBy, describedBy, className = '', image, children }) {
  return <article data-analytics={analyticsId}>
    <a className={`project-row${image ? '' : ' project-row--text'}${className ? ` ${className}` : ''}`} href={href} id={id} aria-labelledby={labelledBy} aria-describedby={describedBy}>
      <div className="project-copy">{children}</div>
      {image}
    </a>
  </article>;
}
