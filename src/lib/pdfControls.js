// Read only toolbar-relevant state. The engine store returns a new root object
// on every read, so a primitive snapshot avoids React subscription loops and
// rerendering controls for tile/selection updates.
export function pdfControlSnapshot(store) {
  if (!store) return JSON.stringify({ ready: false, page: 1, total: 0, zoom: 100 });
  const state = store.getState();
  const id = state.core.activeDocumentId;
  const doc = state.core.documents[id];
  const scroll = state.plugins.scroll?.documents[id];
  const zoom = state.plugins.zoom?.documents[id];
  return JSON.stringify({
    id, ready: doc?.status === 'loaded',
    page: scroll?.currentPage || 1,
    total: scroll?.totalPages || doc?.document?.pageCount || 0,
    zoom: Math.round((zoom?.currentZoomLevel || 1) * 100),
    zoomMode: zoom?.zoomLevel,
  });
}

export const pdfReaderSchema = {
  id: 'portfolio-pdf-reader', version: '1.0.0',
  toolbars: {}, menus: {}, sidebars: {}, modals: {}, overlays: {}, selectionMenus: {},
};
