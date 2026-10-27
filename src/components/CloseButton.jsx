export default function CloseButton({ label = 'Close preview', onClick, autoFocus = false }) {
  return <button className="close-button" type="button" onClick={onClick} aria-label={label} autoFocus={autoFocus}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  </button>;
}
