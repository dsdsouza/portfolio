import StorySections from './StorySections.jsx';
import DetailPage from './DetailPage.jsx';
import StorySection from './StorySection.jsx';
import EntryLinks from './EntryLinks.jsx';
import ProjectScreenshot from './ProjectScreenshot.jsx';

export default function ProjectDetails({ project, headingRef }) {
  return <DetailPage title={project.title} logo={project.logo} headingRef={headingRef}
    backHref="#/projects" backLabel="Back to projects">
    {project.organization && <p className="detail-meta">{project.organization}</p>}
    {project.period && <p className="detail-meta">{project.period}</p>}
    {project.role && <p className="detail-meta">{project.role}</p>}
    {project.recognition && <p className="recognition">{project.recognition}</p>}
    <p className="detail-overview">{project.overview || project.summary}</p>
    <EntryLinks title={project.title} links={project.links} />
    <ProjectScreenshot project={project} />
    {(project.contribution || project.work?.length > 0) && <StorySection title="What I did" text={project.contribution} items={project.work} />}
    {project.outcome && <StorySection title="Result" text={project.outcome} />}
    {project.technologies?.length > 0 && <StorySection title="Built with" items={project.technologies} />}
    <StorySections sections={project.sections} />
  </DetailPage>;
}
