// src/pages/landing/HeroBackgroundMedia.tsx
//
// Replaces the single hardcoded background <img> that used to live inline
// in HeroSection.tsx. Renders admin-controlled hero media (images and/or
// video, see useHeroMedia) as a cross-fading carousel, falling back to the
// same static /assets/images/hubimage.jpg whenever there's no active media
// configured or the fetch fails - that fallback stays hardcoded forever,
// it is never seeded into the database.
//
// Split into a hook + two presentational pieces because of where each one
// has to live in HeroSection.tsx's existing DOM: the media LAYERS must
// stay exactly where the old <img> was (inside the background wrapper,
// BEFORE the two gradient overlay divs, so the overlay still tints the
// photo/video for text contrast) - but the DOT controls are real
// interactive elements that need to sit visually and hit-test ABOVE those
// same overlay divs, which are non-pointer-events-none `absolute inset-0`
// siblings that would otherwise swallow clicks on anything rendered
// before them. Rendering the dots as a later sibling of the whole
// background wrapper (see HeroSection.tsx) sidesteps that with plain DOM
// order instead of fighting z-index across unrelated stacking contexts.
import { useEffect, useRef, useState } from "react";
import { useHeroMedia } from "../../hooks/useHeroMedia";
import type { HeroMedia } from "../../types/heroMedia.types";

const FALLBACK_IMAGE_SRC = "/assets/images/hubimage.jpg";
const AUTO_ADVANCE_MS = 6000;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReduced(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return reduced;
}

interface HeroBackgroundCarousel {
  activeMedia: HeroMedia[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  reducedMotion: boolean;
  setHovered: (hovered: boolean) => void;
  handleMediaError: (id: string) => void;
}

export function useHeroBackgroundCarousel(): HeroBackgroundCarousel {
  const { media } = useHeroMedia();
  const reducedMotion = usePrefersReducedMotion();

  // Individual load failures are excluded rather than crashing the
  // carousel - if every configured item ends up here, activeMedia is
  // empty and the static fallback renders, same as "no media configured".
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set());
  const activeMedia = media.filter((m) => !failedIds.has(m.id));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  // The public API already sorts the admin-marked default item first (see
  // heroMedia.controller.ts) - array position alone carries that, no
  // separate field needed. Only the FIRST time media actually loads does
  // this matter; deliberately not re-running on every later refetch so an
  // admin's background edits don't yank a visitor's current slide back to
  // index 0 mid-visit.
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (hasInitialized.current || activeMedia.length === 0) return;
    hasInitialized.current = true;
    setCurrentIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMedia.length]);

  // Keeps the index in range if the active list shrinks (an admin
  // deactivating/deleting items) while a visitor is mid-carousel - same
  // guard HeroSection.tsx's own team-member carousel already uses.
  useEffect(() => {
    if (activeMedia.length > 0 && currentIndex >= activeMedia.length) {
      setCurrentIndex(0);
    }
  }, [activeMedia.length, currentIndex]);

  // Auto-advance: never runs at all under prefers-reduced-motion (not just
  // "simpler" - WCAG 2.2.2 is about not forcing automatically-moving
  // content on someone who asked not to have it), and pauses on hover so
  // a visitor reading over the hero isn't fighting a changing background.
  useEffect(() => {
    if (reducedMotion || hovered || activeMedia.length < 2) return undefined;

    const timer = setInterval(() => {
      if (document.hidden) return;
      setCurrentIndex((prev) => (prev + 1) % activeMedia.length);
    }, AUTO_ADVANCE_MS);

    return () => clearInterval(timer);
  }, [reducedMotion, hovered, activeMedia.length]);

  const handleMediaError = (id: string) => {
    setFailedIds((prev) => new Set(prev).add(id));
  };

  return {
    activeMedia,
    currentIndex,
    setCurrentIndex,
    reducedMotion,
    setHovered,
    handleMediaError,
  };
}

interface LayersProps {
  activeMedia: HeroMedia[];
  currentIndex: number;
  reducedMotion: boolean;
  setHovered: (hovered: boolean) => void;
  onError: (id: string) => void;
}

// Renders inside HeroSection.tsx's background wrapper, in the exact
// position the old static <img> used to occupy.
export const HeroBackgroundMediaLayers = ({
  activeMedia,
  currentIndex,
  reducedMotion,
  setHovered,
  onError,
}: LayersProps) => {
  if (activeMedia.length === 0) {
    return (
      <img
        src={FALLBACK_IMAGE_SRC}
        alt=""
        className="w-full h-full object-cover"
      />
    );
  }

  // Only the current slide and the next one are actually mounted (not
  // just opacity-hidden) - a visitor never causes every configured
  // video's stream to be fetched at once just by loading the homepage.
  const mountedIndexes = new Set(
    activeMedia.length === 1
      ? [0]
      : [currentIndex, (currentIndex + 1) % activeMedia.length],
  );

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {activeMedia.map((item, index) => {
        if (!mountedIndexes.has(index)) return null;
        const isCurrent = index === currentIndex;

        return (
          <div
            key={item.id}
            className={`absolute inset-0 ${
              reducedMotion
                ? isCurrent
                  ? "opacity-100"
                  : "opacity-0"
                : `transition-opacity duration-1000 ${isCurrent ? "opacity-100" : "opacity-0"}`
            }`}
            aria-hidden={!isCurrent}
          >
            {item.type === "VIDEO" ? (
              <video
                src={item.url}
                poster={item.thumbnailUrl ?? undefined}
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
                className="w-full h-full object-cover"
                onError={() => onError(item.id)}
              />
            ) : (
              <img
                src={item.url}
                alt={item.altText ?? ""}
                loading={index === 0 ? "eager" : "lazy"}
                className="w-full h-full object-cover"
                onError={() => onError(item.id)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

interface DotsProps {
  activeMedia: HeroMedia[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

// Renders as a LATER sibling of the whole background wrapper (see
// HeroSection.tsx) - not aria-hidden, and painted after the gradient
// overlays so it's both visible and clickable above them. Renders
// nothing for the common single-item case, matching the brief's own
// "no clutter for one image" guidance.
export const HeroBackgroundDots = ({
  activeMedia,
  currentIndex,
  onSelect,
}: DotsProps) => {
  if (activeMedia.length < 2) return null;

  return (
    <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
      {activeMedia.map((item, index) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(index)}
          aria-label={`Show hero background ${index + 1} of ${activeMedia.length}`}
          aria-current={index === currentIndex}
          className={`rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1 ${
            index === currentIndex
              ? "bg-white w-6 h-2"
              : "bg-white/50 hover:bg-white/75 w-2 h-2"
          }`}
        />
      ))}
    </div>
  );
};
