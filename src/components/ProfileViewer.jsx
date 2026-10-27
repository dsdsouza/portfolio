import ResumeView from './ResumeView.jsx';
import LinkedInCard from './LinkedInCard.jsx';
import RemoteBrowserView from './RemoteBrowserView.jsx';

// This entire module (including the local browser helper) loads on first open.
export default function ProfileViewer({ viewer, link, profile }) {
  if (viewer === 'resume') return <ResumeView src={profile.resume} name={profile.name} />;
  if (viewer === 'linkedin') return <LinkedInCard href={link.href} />;
  return <RemoteBrowserView site={viewer} href={link.href} label={link.label} />;
}
