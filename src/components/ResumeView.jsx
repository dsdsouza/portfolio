import { lazy, Suspense } from 'react';

const PdfDocument = lazy(() => import('./PdfDocument.jsx'));

export default function ResumeView({ src, name }) {
  return (
    <section className="resume-view" aria-label="Resume PDF">
      <Suspense fallback={<p className="resume-loading" role="status">Loading resume…</p>}>
        <PdfDocument src={src} name={name} />
      </Suspense>
    </section>
  );
}
