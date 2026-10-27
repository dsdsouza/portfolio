import EntryRow from './EntryRow.jsx';
import EntryTitle from './EntryTitle.jsx';
import { getCoverImage } from '../lib/galleryImages.js';
import ProjectScreenshot from './ProjectScreenshot.jsx';

export default function ProjectList({ projects }) {
  if (!projects.length) return <p className="empty-state">New projects will appear here. You can find more of my background in Work and Education.</p>;
  return <div className="project-list">
    {projects.map((project, index) => <EntryRow key={project.slug}
      href={`#/projects/${project.slug}`} analyticsId={`project-card:${project.slug}`}
      labelledBy={`project-${project.slug}`}
      describedBy={`${project.recognition ? `recognition-${project.slug} ` : ''}summary-${project.slug}`}
      image={getCoverImage(project) && <ProjectScreenshot project={project} preview loading={index === 0 ? 'eager' : 'lazy'} />}>
      <EntryTitle id={`project-${project.slug}`} title={project.title} logo={project.logo} />
      {project.recognition && <p id={`recognition-${project.slug}`} className="recognition">{project.recognition}</p>}
      <p id={`summary-${project.slug}`} className="project-summary">{project.summary}</p>
    </EntryRow>)}
  </div>;
}
