import { useCallback, useMemo, useState } from 'react';
import { PDFViewer, ZoomMode } from '@embedpdf/react-pdf-viewer';
import { pdfIcons, pdfTheme, pdfUiStyles } from '../lib/pdfTheme.js';
import { pdfReaderSchema } from '../lib/pdfControls.js';
import PdfToolbar from './PdfToolbar.jsx';
import wasmUrl from '@embedpdf/pdfium/pdfium.wasm?url';

// Keep the maintained renderer, text selection, and native printing utility;
// our own toolbar replaces the editor-style chrome and floating overlays.
export default function PdfDocument({ src, name }) {
  const [registry, setRegistry] = useState(null);
  const config = useMemo(() => ({
    src: new URL(src, window.location.href).href, wasmUrl,
    worker: false, log: false, tabBar: 'never',
    zoom: { defaultZoomLevel: ZoomMode.FitWidth },
    theme: pdfTheme, icons: pdfIcons,
    ui: { schema: pdfReaderSchema },
    fontFallback: null,
    fonts: { ui: { stylesheetUrl: null, family: 'Figtree, Arial, sans-serif' }, signature: null },
    disabledCategories: ['annotation', 'redaction', 'form', 'insert', 'history', 'capture', 'document-capture', 'document-open', 'document-close', 'document-protect', 'security', 'panel', 'page-settings', 'document-menu'],
  }), [src]);
  const ready = useCallback((instance) => {
    // Ctrl/Cmd+P follows the same native print/save route as the toolbar.
    instance.getPlugin('commands').provides().registerCommand({
      id: 'document:print', label: 'Print or save as PDF', icon: 'print',
      shortcuts: ['Ctrl+P', 'Meta+P'], categories: ['document', 'document-print'],
      action: ({ registry, documentId }) => registry.getPlugin('print').provides().forDocument(documentId).print(),
    });
    setRegistry(instance);
  }, []);
  return <div className="resume-pdf-viewer" aria-label={`${name} — resume PDF viewer`}>
    <PdfToolbar registry={registry} />
    <div className="pdf-document-viewport">
      <PDFViewer config={config} style={{ width: '100%', height: '100%' }} onReady={ready} onInit={(container) => {
        const style = document.createElement('style');
        style.textContent = pdfUiStyles;
        container.shadowRoot.append(style);
      }} />
    </div>
  </div>;
}
