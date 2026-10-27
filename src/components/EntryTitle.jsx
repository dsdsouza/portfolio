import AssetImage from './AssetImage.jsx';
export function EntryLogo({ src, className = 'project-logo', loading }) {
  return src ? <AssetImage className={className} src={src} sizes="24px" width="24" height="24" alt="" loading={loading} /> : null;
}

export default function EntryTitle({ as: Heading = 'h2', title, logo, logoLoading, headingRef, ...props }) {
  return <Heading ref={headingRef} className="project-title" {...props}>
    <EntryLogo src={logo} loading={logoLoading} />
    <span>{title}</span>
  </Heading>;
}
