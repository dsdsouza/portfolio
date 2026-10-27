import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import { ZoomMode } from '@embedpdf/react-pdf-viewer';
import { pdfControlSnapshot } from '../lib/pdfControls.js';
import { pdfIcons } from '../lib/pdfTheme.js';

function PdfIcon({ name }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d={pdfIcons[name].path} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}
function ToolButton({ label, icon, children, ...props }) {
  return <button type="button" className="pdf-tool-button" aria-label={label} title={label} {...props}>
    <PdfIcon name={icon} />{children}
  </button>;
}

export default function PdfToolbar({ registry }) {
  const store = registry?.getStore();
  const subscribe = useCallback((notify) => store ? store.subscribe(notify) : () => {}, [store]);
  const snapshot = useSyncExternalStore(subscribe, () => pdfControlSnapshot(store));
  const state = useMemo(() => JSON.parse(snapshot), [snapshot]);
  const [printing, setPrinting] = useState(false);
  const [error, setError] = useState('');
  const scope = (plugin) => registry.getPlugin(plugin).provides().forDocument(state.id);
  const print = () => {
    setPrinting(true); setError('');
    scope('print').print().wait(() => setPrinting(false), () => {
      setPrinting(false); setError('Printing could not start. Please try again.');
    });
  };
  const zoomValues = [50, 75, 100, 125, 150, 200, 300];
  const fitted = state.zoomMode === ZoomMode.FitWidth ? 'width' : state.zoomMode === ZoomMode.FitPage ? 'page' : String(state.zoom);
  return <>
    <div className="pdf-toolbar" role="group" aria-label="PDF controls">
      <div className="pdf-tool-group pdf-zoom">
        <ToolButton label="Zoom out" icon="zoomOut" disabled={!state.ready || state.zoom <= 25} onClick={() => scope('zoom').zoomOut()} />
        <label className="pdf-zoom-label"><span className="sr-only">Zoom level</span>
          <select value={fitted} disabled={!state.ready} onChange={(event) => scope('zoom').requestZoom(event.target.value === 'width' ? ZoomMode.FitWidth : event.target.value === 'page' ? ZoomMode.FitPage : Number(event.target.value) / 100)}>
            <option value="width">Fit width</option><option value="page">Fit page</option>
            {!zoomValues.includes(state.zoom) && <option value={state.zoom}>{state.zoom}%</option>}
            {zoomValues.map((zoom) => <option key={zoom} value={zoom}>{zoom}%</option>)}
          </select><PdfIcon name="chevronDown" />
        </label>
        <ToolButton label="Zoom in" icon="zoomIn" disabled={!state.ready || state.zoom >= 300} onClick={() => scope('zoom').zoomIn()} />
      </div>
      <ToolButton label="Rotate clockwise" icon="rotateClockwise" disabled={!state.ready} onClick={() => scope('rotate').rotateForward()} />
      <ToolButton label="Print or save as PDF" icon="print" disabled={!state.ready || printing} onClick={print} className="pdf-tool-button pdf-print-button">
        <span>{printing ? 'Preparing…' : 'Print / Export'}</span>
      </ToolButton>
    </div>
    {error && <p className="pdf-control-error" role="alert">{error}</p>}
  </>;
}
