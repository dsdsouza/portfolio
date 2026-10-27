import AssetImage from './AssetImage.jsx';
import ExternalLink from './ExternalLink.jsx';
import EmailMenu from './EmailMenu.jsx';
import { useMediaQuery } from '../lib/useMediaQuery.js';

export default function Header({ profile, activeViewer, onViewerOpen }) {
  const directLinks = useMediaQuery('(max-width: 600px)');
  const contactEmails = [...profile.emails].sort((a, b) => Number(Boolean(b.mobilePrimary)) - Number(Boolean(a.mobilePrimary)));
  return (
    <header data-analytics="section:about" className={`profile-header${profile.portrait ? ' profile-header--portrait' : ''}`}>
      <div className="profile-intro">
      <h1><a className="identity-link" href="#/projects">{profile.name}</a></h1>
      <p className="introduction">{profile.introduction}</p>
      <p className="experience-summary">{profile.experienceSummary}</p>
      <p className="location">{profile.location}</p>
      </div>
      {profile.portrait && <AssetImage className="profile-portrait" src={profile.portrait.src} alt={profile.portrait.alt || profile.name} width={profile.portrait.width} height={profile.portrait.height} fetchPriority="high" loading="eager" sizes="(max-width: 360px) 92px, (max-width: 600px) 110px, 164px" />}
      {profile.about && <p className="about-me">{profile.about}</p>}
      <nav className="profile-links" aria-label="Contact and resume">
        {profile.links.map((link) => directLinks
          ? link.href.startsWith('mailto:')
            ? contactEmails.map((email, index) => <a key={email.address} href={`mailto:${email.address}`}>{index === 0 ? link.label : `${email.label} email`}</a>)
            : <ExternalLink key={link.label} href={link.viewer === 'resume' ? profile.resume : link.href}>{link.label}</ExternalLink>
          : link.href.startsWith('mailto:')
          ? contactEmails.map((email, index) => <EmailMenu key={email.address} emails={[email]} label={index === 0 ? link.label : `${email.label} email`} />)
          : link.viewer === 'github' && import.meta.env.PROD
            ? <ExternalLink key={link.label} href={link.href}>{link.label}</ExternalLink>
          : link.viewer
            ? <button key={link.label} className="text-button" type="button" aria-haspopup="dialog" aria-expanded={activeViewer === link.viewer} onClick={() => onViewerOpen(link.viewer)}>{link.label}</button>
            : <ExternalLink key={link.label} href={link.href}>{link.label}</ExternalLink>)}
      </nav>
    </header>
  );
}
