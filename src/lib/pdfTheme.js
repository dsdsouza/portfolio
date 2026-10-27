// Shared portfolio styling for EmbedPDF's isolated UI.
// Icons use the viewer's supported path registry, not DOM replacements.
const paths = {
  download: 'M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5',
  save: 'M5 3h12l4 4v14H3V3h2Zm2 0v7h10V3M7 21v-7h10v7',
  menu: 'M4 6h16M4 12h16M4 18h16',
  sidebar: 'M3 4h18v16H3ZM9 4v16M5 8h2M5 12h2M5 16h2',
  fullscreen: 'M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5',
  fullscreenExit: 'M3 8h5V3m8 0v5h5M8 21v-5H3m13 5v-5h5',
  print: 'M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M7 14h10v7H7ZM17 11h1',
  zoomIn: 'M4 12h16M12 4v16',
  zoomOut: 'M4 12h16',
  fitToWidth: 'M3 4v16M21 4v16M4 12h16M7 9l-3 3 3 3m10-6 3 3-3 3',
  fitToPage: 'M7 3H3v4m14-4h4v4M3 17v4h4m14-4v4h-4M8 7h8v10H8Z',
  chevronRight: 'm9 5 7 7-7 7',
  chevronLeft: 'm15 5-7 7 7 7',
  chevronDown: 'm5 9 7 7 7-7',
  search: 'M16 10a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm-1 5 6 6',
  rotateClockwise: 'M20 9a8 8 0 1 0 0 6M20 3v6h-6',
  rotateCounterClockwise: 'M4 9a8 8 0 1 1 0 6M4 3v6h6',
  singlePage: 'M5 3h14v18H5ZM8 8h8M8 12h8M8 16h5',
  doublePage: 'M2 4h9v16H2Zm11 0h9v16h-9',
  viewSettings: 'M3 6h18M3 12h18M3 18h18M8 3v6m8 0v6M8 15v6',
  settings: 'M3 6h18M3 12h18M3 18h18M8 3v6m8 0v6M8 15v6',
  dots: 'M5 11h2v2H5Zm6 0h2v2h-2Zm6 0h2v2h-2',
};

export const pdfIcons = Object.fromEntries(Object.entries(paths).map(([name, path]) => [name, {
  path, viewBox: '0 0 24 24', stroke: 'primary', fill: 'none',
  strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round',
}]));

export const pdfTheme = { preference: 'light', light: {
  background: { app: '#dfe3db', surface: '#eeefeb', surfaceAlt: '#e3e6df', elevated: '#eeefeb', input: '#eeefeb', overlay: 'rgb(39 43 37 / .4)' },
  foreground: { primary: '#272b25', secondary: '#5f665b', muted: '#5f665b', disabled: '#7a8176', onAccent: '#eeefeb' },
  border: { default: '#cdd2c8', subtle: '#dfe3db', strong: '#5f665b' },
  accent: { primary: '#3b5541', primaryHover: '#304636', primaryActive: '#273b2d', primaryLight: '#dfe4d9', primaryForeground: '#eeefeb' },
  interactive: { hover: '#dfe4d9', active: '#cdd7c8', selected: '#dfe4d9', focus: '#3b5541', focusRing: '#3b5541' },
  tooltip: { background: '#272b25', foreground: '#eeefeb' },
  scrollbar: { track: '#dfe3db', thumb: '#a5ad9e', thumbHover: '#7a8176' },
} };

export const pdfUiStyles = `
  img { -webkit-user-drag: none; user-select: none; }
  *, *::before, *::after { border-radius: 0 !important; }
  button, input, select, [role="menu"], [role="dialog"], [role="tooltip"] {
    font-family: Figtree, Arial, sans-serif;
    box-shadow: none !important;
  }
  button { transition: background-color 120ms ease, color 120ms ease; }
  button:focus-visible, input:focus-visible, select:focus-visible {
    outline: 2px solid #3b5541; outline-offset: 2px;
  }
  input { accent-color: #3b5541; }
  svg { stroke-linecap: round; stroke-linejoin: round; }
  ::selection { background: #3b5541; color: #eeefeb; }
  @media (prefers-reduced-motion: reduce) { button { transition: none; } }
`;
