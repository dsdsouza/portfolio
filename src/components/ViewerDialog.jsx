import { useEffect, useRef } from 'react';
import CloseButton from './CloseButton.jsx';

export default function ViewerDialog({ title, onClose, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const scrollY = window.scrollY;
    const body = document.body;
    const root = document.documentElement;
    const previousBody = Object.fromEntries(['overflow', 'position', 'top', 'width', 'paddingRight'].map((key) => [key, body.style[key]]));
    const previousRoot = { overflow: root.style.overflow, overscrollBehavior: root.style.overscrollBehavior };
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    const paddingRight = parseFloat(getComputedStyle(body).paddingRight) || 0;
    dialog.showModal();
    root.style.overflow = 'hidden';
    root.style.overscrollBehavior = 'none';
    Object.assign(body.style, { overflow: 'hidden', position: 'fixed', top: `-${scrollY}px`, width: '100%', paddingRight: `${paddingRight + scrollbarWidth}px` });
    dialog.scrollTop = 0;
    return () => {
      dialog.close();
      Object.assign(body.style, previousBody);
      Object.assign(root.style, previousRoot);
      window.scrollTo({ top: scrollY, behavior: 'instant' });
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog ref={dialogRef} className="viewer-dialog" aria-labelledby="viewer-title" aria-modal="true" onKeyDown={(event) => {
      if (event.key !== 'Tab') return;
      // The PDF viewer uses a shadow root. Include its controls in the modal's
      // focus order so Tab doesn't become trapped on the outer X button.
      function focusable(root) {
        return [...root.querySelectorAll('*')].flatMap((element) => [
          ...(element.matches('button, a[href], input, select, textarea, [tabindex]') && !element.disabled && element.tabIndex >= 0 && element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden' ? [element] : []),
          ...(element.shadowRoot ? focusable(element.shadowRoot) : []),
        ]);
      }
      const controls = focusable(event.currentTarget);
      let active = document.activeElement;
      while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && active === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && active === last) { event.preventDefault(); first?.focus(); }
    }} onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
    }}>
      <div className="viewer-heading">
        <h2 id="viewer-title">{title}</h2>
        <CloseButton autoFocus onClick={onClose} label={`Close ${title} preview`} />
      </div>
      <div className="viewer-content">{children}</div>
    </dialog>
  );
}
