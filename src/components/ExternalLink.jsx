export default function ExternalLink({ href, children, ...props }) {
  const opensTab = !href.startsWith('mailto:');
  return <a href={href} {...(opensTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...props}>{children}</a>;
}
