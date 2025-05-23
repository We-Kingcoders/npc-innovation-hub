import React, { useState } from "react";
import type { Project } from "../../data/projectsData";

interface ProjectsHighlightSectionProps {
  projects: Project[];
  onExploreAll?: () => void;
}

const DOT_SIZE = 10;
const VISIBLE_COUNT = 2;
const CARD_WIDTH = 280;
const CARD1_HEIGHT = 350;
const CARD2_HEIGHT = 300;
const DOTS_HEIGHT = CARD1_HEIGHT - CARD2_HEIGHT;

const ProjectsHighlightSection: React.FC<ProjectsHighlightSectionProps> = ({
  projects,
  onExploreAll,
}) => {
  const [index, setIndex] = useState(0);

  if (!projects || projects.length < 2) return null;

  const canScrollLeft = index > 0;
  const canScrollRight = index + VISIBLE_COUNT < projects.length;

  const handlePrev = () => {
    if (canScrollLeft) setIndex(index - 1);
  };
  const handleNext = () => {
    if (canScrollRight) setIndex(index + 1);
  };

  // Dots logic: one dot per possible window
  const dotCount = Math.max(1, projects.length - VISIBLE_COUNT + 1);

  const renderCardContent = (proj: Project) => (
    <div className="absolute inset-0 flex flex-col justify-between">
      {/* Owner info and View button, aligned bottom */}
      <div>{/* Empty, content is in the middle */}</div>
      {/* Project title & description centered */}
      <div className="flex flex-col items-center justify-center h-full px-4">
        <span className="text-gray-200 text-xl font-light text-center mb-2 drop-shadow-md">
          {proj.title}
        </span>
        <span className="text-gray-300 text-xs text-center mb-2 drop-shadow-md">
          {proj.description}
        </span>
      </div>
      <div className="w-full px-3 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={proj.ownerAvatar}
            alt={proj.owner}
            className="w-6 h-6 rounded-full border border-gray-200"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-gray-200 text-xs font-semibold truncate">
              {proj.owner}
            </span>
            <span className="text-gray-300 italic text-[10px] leading-tight truncate">
              {proj.ownerRole}
            </span>
          </div>
        </div>
        <a
          href={proj.link}
          className="flex items-center px-2 py-0.5 text-xs rounded-full bg-white/20 text-gray-200 border border-white/30 hover:bg-white/40 transition ml-2"
        >
          View more
          <svg
            className="ml-1 w-3 h-3"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              d="M14 3h7v7m0 0L10 21l-7-7L14 3z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </div>
  );

  return (
    <div className="bg-[#05305C] w-full py-36  px-2 md:px-0">
      <div className="w-full max-w-[928px] mx-auto flex flex-col md:flex-row gap-12 items-center">
        {/* Text section */}
        <div className="w-full max-w-[260px] flex flex-col items-center md:items-start">
          <h3 className="text-gray-200 text-[28px] font-semibold mb-2 text-center md:text-left leading-tight">
            30+ Projects have been created
          </h3>
          <p className="text-gray-300 text-md mt-8 text-center md:text-left leading-snug">
            Our portfolio includes over 30 full-stack projects, showcasing
            robust frontend interfaces backed by powerful and scalable backend
            systems. Each project demonstrates our ability to build complete,
            responsive, and user-centric digital solutions from the ground up.
          </p>

          <button
            className="px-8 py-3 mt-12 rounded-full border border-gray-500 text-gray-200 hover:bg-white/10 transition text-sm"
            onClick={onExploreAll}
          >
            Explore all projects
          </button>
        </div>

        {/* Carousel section */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div
            className="relative flex w-[600px]"
            style={{ height: CARD1_HEIGHT }}
          >
            {/* Left arrow */}
            {canScrollLeft && (
              <button
                aria-label="Previous"
                onClick={handlePrev}
                className="absolute z-10 left-[-28px] top-1/2 -translate-y-1/2 bg-transparent border-0 p-0"
              >
                <svg width={36} height={36} fill="none" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="18"
                    fill="#fff"
                    fillOpacity="0.18"
                  />
                  <path
                    d="M20.5 24l-5-6 5-6"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}

            {/* Cards */}
            <div className="flex w-full h-full gap-3">
              {/* First Card */}
              <div
                className="relative overflow-hidden bg-gray-200"
                style={{
                  borderRadius: 0,
                  minWidth: 0,
                  minHeight: 0,
                  flex: "none",
                  width: CARD_WIDTH,
                  height: CARD1_HEIGHT,
                }}
              >
                {projects[index] && (
                  <>
                    <img
                      src={projects[index].image}
                      alt={projects[index].title}
                      className="w-full h-full object-cover"
                      style={{ borderRadius: 0 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                    {renderCardContent(projects[index])}
                  </>
                )}
              </div>
              {/* Second Card + Dots below */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: CARD_WIDTH,
                  height: CARD1_HEIGHT,
                }}
              >
                {/* Second Card */}
                <div
                  style={{
                    width: CARD_WIDTH,
                    height: CARD2_HEIGHT,
                    position: "relative",
                    overflow: "hidden",
                  }}
                  className="bg-gray-200"
                >
                  {projects[index + 1] && (
                    <>
                      <img
                        src={projects[index + 1].image}
                        alt={projects[index + 1].title}
                        className="w-full h-full object-cover"
                        style={{ borderRadius: 0 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 via-blue-950/40 to-transparent" />
                      {renderCardContent(projects[index + 1])}
                    </>
                  )}
                </div>
                {/* Dots */}
                <div
                  style={{
                    width: CARD_WIDTH,
                    height: DOTS_HEIGHT,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {[...Array(dotCount)].map((_, i) => (
                    <span
                      key={i}
                      className={`inline-block mx-[3px] rounded-full transition-all duration-200 ${
                        i === index
                          ? "scale-125 bg-white"
                          : "scale-100 bg-white/30"
                      }`}
                      style={{
                        width: DOT_SIZE,
                        height: DOT_SIZE,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* Right arrow */}
            {canScrollRight && (
              <button
                aria-label="Next"
                onClick={handleNext}
                className="absolute z-10 right-[-28px] top-1/2 -translate-y-1/2 bg-transparent border-0 p-0"
              >
                <svg width={36} height={36} fill="none" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="18"
                    fill="#fff"
                    fillOpacity="0.18"
                  />
                  <path
                    d="M15.5 12l5 6-5 6"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsHighlightSection;
