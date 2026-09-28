jest.mock("../../hooks/useHeroMedia", () => ({
  __esModule: true,
  useHeroMedia: jest.fn(),
}));

import { render, screen, fireEvent, act } from "@testing-library/react";
import {
  useHeroBackgroundCarousel,
  HeroBackgroundMediaLayers,
  HeroBackgroundDots,
} from "./HeroBackgroundMedia";
import { useHeroMedia } from "../../hooks/useHeroMedia";
import type { HeroMedia } from "../../types/heroMedia.types";

const mockedUseHeroMedia = useHeroMedia as jest.Mock;

// Mirrors exactly how HeroSection.tsx composes these three pieces - the
// hook drives shared state, the two presentational components render it.
function Harness() {
  const carousel = useHeroBackgroundCarousel();
  return (
    <div>
      <HeroBackgroundMediaLayers
        activeMedia={carousel.activeMedia}
        currentIndex={carousel.currentIndex}
        reducedMotion={carousel.reducedMotion}
        setHovered={carousel.setHovered}
        onError={carousel.handleMediaError}
      />
      <HeroBackgroundDots
        activeMedia={carousel.activeMedia}
        currentIndex={carousel.currentIndex}
        onSelect={carousel.setCurrentIndex}
      />
    </div>
  );
}

function mockMatchMedia(matches: boolean) {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
}

const IMAGE_ITEM: HeroMedia = {
  id: "img-1",
  type: "IMAGE",
  url: "https://example.com/one.jpg",
  thumbnailUrl: null,
  altText: "Students collaborating",
};

const VIDEO_ITEM: HeroMedia = {
  id: "vid-1",
  type: "VIDEO",
  url: "https://example.com/intro.mp4",
  thumbnailUrl: "https://example.com/intro.jpg",
  altText: null,
};

describe("HeroBackgroundMedia", () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it("falls back to the static hero image when there is no active media", () => {
    mockedUseHeroMedia.mockReturnValue({
      media: [],
      loading: false,
      error: null,
      fetchMedia: jest.fn(),
    });

    render(<Harness />);

    const img = screen.getByRole("img") as HTMLImageElement;
    expect(img.src).toContain("/assets/images/hubimage.jpg");
    // No dots for the fallback/single-item case.
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("falls back to the static image on a fetch error too, not a blank hero", () => {
    mockedUseHeroMedia.mockReturnValue({
      media: [],
      loading: false,
      error: "Network error",
      fetchMedia: jest.fn(),
    });

    render(<Harness />);

    const img = screen.getByRole("img") as HTMLImageElement;
    expect(img.src).toContain("/assets/images/hubimage.jpg");
  });

  it("renders a single configured image with its alt text and no dots", () => {
    mockedUseHeroMedia.mockReturnValue({
      media: [IMAGE_ITEM],
      loading: false,
      error: null,
      fetchMedia: jest.fn(),
    });

    render(<Harness />);

    expect(screen.getByAltText("Students collaborating")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders a video item with autoplay/muted/loop/playsInline and a poster", () => {
    mockedUseHeroMedia.mockReturnValue({
      media: [VIDEO_ITEM],
      loading: false,
      error: null,
      fetchMedia: jest.fn(),
    });

    const { container } = render(<Harness />);

    const video = container.querySelector("video");
    expect(video).not.toBeNull();
    expect(video).toHaveAttribute("autoplay");
    // React sets `muted` as a DOM property, not an HTML attribute (it must
    // be a property for the browser's autoplay-without-sound policy to
    // actually honor it) - toHaveAttribute wouldn't see it.
    expect(video?.muted).toBe(true);
    expect(video).toHaveAttribute("loop");
    expect(video).toHaveAttribute("playsinline");
    expect(video?.getAttribute("poster")).toBe("https://example.com/intro.jpg");
  });

  it("shows dot controls for multiple active items, and clicking one switches the visible slide", () => {
    mockedUseHeroMedia.mockReturnValue({
      media: [IMAGE_ITEM, VIDEO_ITEM],
      loading: false,
      error: null,
      fetchMedia: jest.fn(),
    });

    const { container } = render(<Harness />);

    const dots = screen.getAllByRole("button");
    expect(dots).toHaveLength(2);
    expect(dots[0]).toHaveAttribute("aria-current", "true");

    fireEvent.click(dots[1]);

    expect(dots[1]).toHaveAttribute("aria-current", "true");
    // The video slide's own wrapping layer (its parent - the video tag
    // itself is always aria-hidden, being purely decorative) is now the
    // visible, non-aria-hidden one.
    const video = container.querySelector("video");
    expect(video?.parentElement).toHaveAttribute("aria-hidden", "false");
  });

  it("auto-advances through multiple items over time when motion is not reduced", () => {
    jest.useFakeTimers();
    mockedUseHeroMedia.mockReturnValue({
      media: [IMAGE_ITEM, VIDEO_ITEM],
      loading: false,
      error: null,
      fetchMedia: jest.fn(),
    });

    render(<Harness />);
    const dots = screen.getAllByRole("button");
    expect(dots[0]).toHaveAttribute("aria-current", "true");

    act(() => {
      jest.advanceTimersByTime(6000);
    });

    expect(screen.getAllByRole("button")[1]).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("never auto-advances when prefers-reduced-motion is set, but manual dot clicks still work", () => {
    jest.useFakeTimers();
    mockMatchMedia(true);
    mockedUseHeroMedia.mockReturnValue({
      media: [IMAGE_ITEM, VIDEO_ITEM],
      loading: false,
      error: null,
      fetchMedia: jest.fn(),
    });

    render(<Harness />);
    const dots = screen.getAllByRole("button");
    expect(dots[0]).toHaveAttribute("aria-current", "true");

    act(() => {
      jest.advanceTimersByTime(20000);
    });
    // Still on the first slide - no automatic motion.
    expect(screen.getAllByRole("button")[0]).toHaveAttribute(
      "aria-current",
      "true",
    );

    fireEvent.click(screen.getAllByRole("button")[1]);
    expect(screen.getAllByRole("button")[1]).toHaveAttribute(
      "aria-current",
      "true",
    );
  });
});
