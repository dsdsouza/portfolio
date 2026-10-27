import { useRef } from 'react';

import { portfolioSections as tabs } from '../data/navigation.js';

export default function PortfolioTabs({ activeTab }) {
  const tabRefs = useRef([]);
  function handleKey(event, index) {
    if (event.key === ' ') {
      event.preventDefault();
      window.location.hash = tabs[index].href;
      return;
    }
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    tabRefs.current[next]?.focus();
    window.location.hash = tabs[next].href;
  }
  return (
    <div className="portfolio-tabs" role="tablist" aria-label="Portfolio">
      {tabs.map((tab, index) => (
        <a key={tab.id} ref={(element) => { tabRefs.current[index] = element; }} id={`tab-${tab.id}`} data-label={tab.label} role="tab" href={tab.href} aria-selected={activeTab === tab.id} aria-controls={`panel-${tab.id}`} tabIndex={activeTab === tab.id ? 0 : -1} onKeyDown={(event) => handleKey(event, index)}><span>{tab.label}</span></a>
      ))}
    </div>
  );
}
