import AssetImage from './AssetImage.jsx';
import EntryRow from './EntryRow.jsx';
import EntryTitle from './EntryTitle.jsx';

export default function MemoriesList({ entries }) {
  return <div className="project-list">
    {entries.map((memory) => {
      const cover = memory.thumbnail || memory.photos.find((photo) => photo.src);
      return <EntryRow key={memory.id} href={`#/memories/${memory.id}`} analyticsId={`memory:${memory.id}`}
        labelledBy={`memory-${memory.id}`} className="memory-index-row"
        image={cover && <AssetImage className="memory-index-image" src={cover.src} alt={cover.alt} width="96" height="96" sizes="(max-width: 600px) 72px, 96px" loading="lazy" />}>
        <EntryTitle id={`memory-${memory.id}`} title={memory.title} />
        <p className="detail-meta">{memory.period}</p>
        <p className="project-summary">{memory.description}</p>
      </EntryRow>;
    })}
  </div>;
}
