export default function BackLink({ href, children }) {
  return <a className="back-link" href={href}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M13 8H3m5-5L3 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span>{children}</span>
  </a>;
}
