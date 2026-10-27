import { portfolioSections } from '../data/navigation.js';
import { content } from '../lib/contentCatalog.js';
import ProjectList from './ProjectList.jsx';
import ExperienceList from './ExperienceList.jsx';
import EducationList from './EducationList.jsx';
import MemoriesList from './MemoriesList.jsx';

const lists = {
  projects: () => <ProjectList projects={content.projects} />,
  experience: () => <ExperienceList entries={content.experience} />,
  education: () => <EducationList entries={content.education} />,
  memories: () => <MemoriesList entries={content.memories} />,
};

export default function PortfolioIndex({ activeTab }) {
  return portfolioSections.map(({ id }) => {
    const List = lists[id];
    return <section key={id} id={`panel-${id}`} role="tabpanel" aria-labelledby={`tab-${id}`} hidden={activeTab !== id}>
      {activeTab === id && <List />}
    </section>;
  });
}
