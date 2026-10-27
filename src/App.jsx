import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { profile } from './data/profile.js';
import { useHashRoute } from './lib/useHashRoute.js';
import { resolveRoute } from './lib/contentCatalog.js';
import BackLink from './components/BackLink.jsx';
import Header from './components/Header.jsx';
import PortfolioTabs from './components/PortfolioTabs.jsx';
import PortfolioIndex from './components/PortfolioIndex.jsx';
import ProjectDetails from './components/ProjectDetails.jsx';
import WorkDetails from './components/WorkDetails.jsx';
import MemoryDetails from './components/MemoryDetails.jsx';
import ViewerDialog from './components/ViewerDialog.jsx';
import PreviewBoundary from './components/PreviewBoundary.jsx';

const ProfileViewer = lazy(() => import('./components/ProfileViewer.jsx'));
const detailPages = { project: ProjectDetails, work: WorkDetails, memory: MemoryDetails };

export default function App() {
  const route = useHashRoute();
  const { section, entry, notFound, detailView, title } = resolveRoute(route);
  const previousView = useRef(false);
  const headingRef = useRef(null);
  const [viewer, setViewer] = useState(null);
  const viewerLink = profile.links.find((link) => link.viewer === viewer);

  useEffect(() => { if (detailView) setViewer(null); }, [detailView]);
  useEffect(() => {
    if (route.type === 'resume') {
      setViewer('resume');
      window.location.replace('#/projects');
    }
  }, [route.type]);
  useEffect(() => {
    document.title = `${title} | ${profile.name}`;
    if (detailView) {
      headingRef.current?.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    } else if (previousView.current) {
      document.getElementById(`tab-${section.id}`)?.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
    previousView.current = detailView;
  }, [title, detailView, route.slug, section.id]);

  if (detailView) {
    const Detail = detailPages[route.type];
    return <div className="page page--detail"><main id="main" tabIndex={-1}>
      {notFound ? <div className="project-detail">
        <BackLink href={section.href}>Back to {section.label.toLowerCase()}</BackLink>
        <h1 ref={headingRef} tabIndex={-1}>That page isn’t here.</h1>
        <p className="detail-overview">Find the latest entries in {section.label}.</p>
      </div> : <Detail project={entry} entry={entry} memory={entry} headingRef={headingRef} />}
    </main></div>;
  }

  return <div className="page" id="top">
    <a className="skip-link" href="#main" onClick={(event) => { event.preventDefault(); document.getElementById('main')?.focus(); }}>Skip to content</a>
    <Header profile={profile} activeViewer={viewer} onViewerOpen={setViewer} />
    <main id="main" tabIndex={-1}>
      <PortfolioTabs activeTab={section.id} />
      <PortfolioIndex activeTab={section.id} />
    </main>
    {viewerLink && <ViewerDialog title={viewerLink.label} onClose={() => setViewer(null)}>
      <PreviewBoundary key={viewer} href={viewer === 'resume' ? profile.resume : viewerLink.href}>
        <Suspense fallback={<p className="resume-loading" role="status">Loading {viewerLink.label}…</p>}>
          <ProfileViewer viewer={viewer} link={viewerLink} profile={profile} />
        </Suspense>
      </PreviewBoundary>
    </ViewerDialog>}
  </div>;
}
