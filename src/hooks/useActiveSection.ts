// src/hooks/useActiveSection.ts
//
// Tracks which of a set of page sections (by element id) is currently most
// visible in the viewport, using IntersectionObserver rather than scroll-
// position math - works regardless of section height and doesn't run on
// every scroll event. Used by Navbar.tsx to highlight the right nav link
// while scrolling the single-page Home experience.

import { useEffect, useState } from "react";

export function useActiveSection(
  sectionIds: string[],
  enabled: boolean,
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || sectionIds.length === 0) {
      setActiveId(null);
      return undefined;
    }

    // Not implemented in every environment (JSDOM under Jest, and some
    // older browsers) - degrade to "no active section" rather than
    // throwing and taking the rest of the component tree's effects down
    // with it.
    if (typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return undefined;

    // Tracks each section's current intersection ratio and picks whichever
    // is most visible, rather than just "the first one currently
    // intersecting" - keeps the highlighted link stable and correct even
    // when two short sections are both partly on screen at once.
    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio);
        }
        let bestId: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestId) setActiveId(bestId);
      },
      {
        // Ignores the fixed navbar's own height at the top and only starts
        // counting a section once a meaningful chunk of it is on screen.
        rootMargin: "-80px 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [enabled, sectionIds]);

  return activeId;
}
