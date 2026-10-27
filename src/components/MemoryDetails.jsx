import DetailPage from './DetailPage.jsx';
import ImageGallery from './ImageGallery.jsx';

export default function MemoryDetails({ memory, headingRef }) {
  return <DetailPage title={memory.title} headingRef={headingRef} backHref="#/memories" backLabel="Back to memories">
    <p className="detail-meta">{memory.period}</p>
    <ImageGallery key={memory.id} images={memory.photos} label={memory.title} fit="contain" />
    <section className="story-section" aria-label="My experience">
      <p>{memory.experience}</p>
    </section>
  </DetailPage>;
}
