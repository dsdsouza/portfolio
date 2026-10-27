import { useEffect, useRef, useState } from 'react';

// Native scrolling provides swipe support without another animation library.
export function useImageCarousel(total) {
  const railRef = useRef(null);
  const [index, setIndex] = useState(0);
  const currentIndex = useRef(index);
  currentIndex.current = index;

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let width = 0;
    const observer = new ResizeObserver(() => {
      if (rail.clientWidth === width) return;
      width = rail.clientWidth;
      rail.scrollLeft = width * currentIndex.current;
    });
    observer.observe(rail);
    return () => observer.disconnect();
  }, [total]);

  function go(next) {
    if (!total || !railRef.current) return;
    const position = Math.max(0, Math.min(total - 1, next));
    railRef.current.scrollTo({ left: railRef.current.clientWidth * position,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  function onScroll(event) {
    const rail = event.currentTarget;
    if (rail.clientWidth) setIndex(Math.max(0, Math.min(total - 1, Math.round(rail.scrollLeft / rail.clientWidth))));
  }
  function onKeyDown(event) {
    const destinations = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: total - 1 };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    go(destinations[event.key]);
  }
  return { railRef, index, go, onScroll, onKeyDown };
}
