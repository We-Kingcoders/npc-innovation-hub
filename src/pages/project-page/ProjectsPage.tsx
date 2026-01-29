import { useRef, useEffect, useState } from "react";
import ProjectCard from "../../components/projects/ProjectCard";
import ProjectHero from "../../components/projects/ProjectHero";
import {
  projects,
  featuredProject,
  allProjects,
} from "../../data/projectsData";
import ProjectsHighlightSection from "../../components/projects/ProjectsHighlightSection";

const ProjectsPage = () => {
  const projectsRef = useRef<HTMLDivElement | null>(null);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());

  const scrollToProjects = () => {
    if (projectsRef.current) {
      projectsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Remove duplicates by creating a Set of unique project IDs
  const uniqueProjects = Array.from(
    new Map(allProjects.map((proj) => [proj.id, proj])).values(),
  );

  // Scroll-triggered animations observer for All Projects section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              entry.target.getAttribute("data-index") || "0",
            );
            setVisibleCards((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" },
    );

    const cards = document.querySelectorAll(".animate-on-scroll");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [uniqueProjects.length]);

  return (
    <div className="min-h-screen">
      <style>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }
      `}</style>

      {/* Original Light Theme Section */}
      <div className="bg-gradient-to-b from-white via-gray-50 to-white">
        {/* Hero Section */}
        <ProjectHero onViewProjectsClick={scrollToProjects} />

        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Explore Projects Header */}
          <div
            ref={projectsRef}
            className="text-center pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12"
          >
            <div className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full">
              <svg
                className="w-8 h-8 text-blue-500 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#002B56] to-[#00A0E3] bg-clip-text text-transparent mb-4 sm:mb-6">
              Explore Our Projects
            </h1>
            <p className="max-w-2xl mx-auto text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed px-4">
              Discover how we turn ideas into impactful digital experiences. Our
              projects reflect a blend of strategic thinking, modern design, and
              technical excellence.
            </p>
          </div>

          {/* Top Featured Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16 sm:mb-20 lg:mb-24">
            {projects.slice(0, 2).map((proj, index) => (
              <div
                key={proj.id}
                className="group relative bg-white rounded-2xl lg:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2"
              >
                {/* Decorative Corner Icon */}
                <div className="absolute top-4 right-4 z-10 group-hover:scale-110 transition-transform duration-300">
                  {index === 0 ? (
                    <svg
                      className="w-8 h-8 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-8 h-8 text-cyan-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  )}
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative p-6 sm:p-8">
                  <ProjectCard {...proj} />
                </div>
              </div>
            ))}
          </div>

          {/* Featured Project Section */}
          <div className="text-center mb-16 sm:mb-20 lg:mb-24">
            <div className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-full">
              <svg
                className="w-8 h-8 text-amber-500 mx-auto"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#002B56] to-[#00A0E3] bg-clip-text text-transparent mb-4 sm:mb-6">
              Featured Project
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed mb-10 sm:mb-12 px-4">
              Explore our most impactful and innovative work. This project
              showcases our commitment to quality, creativity, and real-world
              results.
            </p>

            <div className="relative group max-w-5xl mx-auto">
              {/* Decorative Elements */}
              <div className="absolute -top-6 -left-6 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                <svg
                  className="w-16 h-16 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="absolute -bottom-6 -right-6 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                <svg
                  className="w-16 h-16 text-amber-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>

              <div className="relative bg-white rounded-2xl lg:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-blue-100 hover:border-blue-300 transform hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-6 sm:p-8 lg:p-10">
                  <ProjectCard {...featuredProject} variant="featured" />
                </div>
              </div>
            </div>
          </div>

          {/* 30+ Projects Highlight Section */}
          <div className="mb-16 sm:mb-20 lg:mb-24">
            <ProjectsHighlightSection
              projects={projects}
              onExploreAll={scrollToProjects}
            />
          </div>
        </div>
      </div>

      {/* NEW: All Projects Section - Dark Theme with Modern Design */}
      <div className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 overflow-hidden">
        {/* Animated background effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-gray-800/50 backdrop-blur-xl border border-blue-500/20 rounded-full">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              <span className="text-blue-400 font-semibold tracking-wide uppercase text-sm">
                Complete Portfolio
              </span>
            </div>

            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent animate-gradient">
                All Projects
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Explore our comprehensive portfolio of innovative digital
              solutions and creative implementations
            </p>
          </div>

          {/* Timeline Feature */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <h3 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                  Our Journey
                </span>
              </h3>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                A timeline of innovation and growth
              </p>
            </div>

            {/* Horizontal Timeline */}
            <div className="relative max-w-5xl mx-auto">
              {/* Timeline line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />

              {/* Timeline milestones */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { year: "2021", title: "Founded", icon: "rocket" },
                  { year: "2022", title: "Team Growth", icon: "users" },
                  { year: "2023", title: "Recognition", icon: "award" },
                  { year: "2024", title: "30+ Projects", icon: "zap" },
                ].map((milestone, index) => (
                  <div
                    key={index}
                    data-index={500 + index}
                    className="animate-on-scroll opacity-0 relative text-center"
                    style={{
                      transitionDelay: `${index * 150}ms`,
                      opacity: visibleCards.has(500 + index) ? 1 : 0,
                      transform: visibleCards.has(500 + index)
                        ? "translateY(0) scale(1)"
                        : "translateY(2rem) scale(0.9)",
                      transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {/* Node */}
                    <div className="relative z-10 mx-auto mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg shadow-purple-500/50 flex items-center justify-center hover:scale-125 transition-transform duration-300">
                        {milestone.icon === "rocket" && (
                          <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                        )}
                        {milestone.icon === "users" && (
                          <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                        )}
                        {milestone.icon === "award" && (
                          <svg
                            className="w-8 h-8 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        )}
                        {milestone.icon === "zap" && (
                          <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="bg-gray-800/50 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 shadow-xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105">
                      <div className="text-purple-400 font-bold text-lg mb-1">
                        {milestone.year}
                      </div>
                      <div className="text-white font-semibold text-sm">
                        {milestone.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Projects Gallery - Asymmetric Grid with Glass Cards */}
          <div className="space-y-12">
            {(() => {
              const rowPattern = [2, 3, 3, 2];
              const chunked = [];
              let i = 0;
              let patternIndex = 0;

              while (i < uniqueProjects.length) {
                const size = rowPattern[patternIndex % rowPattern.length];
                chunked.push(uniqueProjects.slice(i, i + size));
                i += size;
                patternIndex++;
              }

              return chunked.map((row, rowIndex) => {
                const baseIndex = 200 + rowIndex * 10;

                if (row.length === 2) {
                  return (
                    <div
                      key={rowIndex}
                      className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
                    >
                      {row.map((proj, idx) => (
                        <div
                          key={proj.id}
                          data-index={baseIndex + idx}
                          className="animate-on-scroll opacity-0"
                          style={{
                            transitionDelay: `${idx * 150}ms`,
                            opacity: visibleCards.has(baseIndex + idx) ? 1 : 0,
                            transform: visibleCards.has(baseIndex + idx)
                              ? "translateY(0) scale(1)"
                              : "translateY(2rem) scale(0.95)",
                            transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                        >
                          <div className="group relative h-full">
                            {/* Neon glow on hover */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500" />

                            {/* Glass card with pressed effect */}
                            <div className="relative h-full bg-gray-800/30 backdrop-blur-2xl border border-gray-700/50 rounded-3xl p-8 sm:p-10 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-2 active:translate-y-0">
                              {/* Subtle inner shadow for depth */}
                              <div className="absolute inset-0 rounded-3xl shadow-inner opacity-50" />

                              {/* Raised effect background */}
                              <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                              <div className="relative">
                                <ProjectCard {...proj} />
                              </div>

                              {/* Micro-interaction indicator */}
                              <div className="absolute top-6 right-6 w-3 h-3 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }

                // 3-column layout
                return (
                  <div
                    key={rowIndex}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
                  >
                    {row.map((proj, idx) => (
                      <div
                        key={proj.id}
                        data-index={baseIndex + idx}
                        className="animate-on-scroll opacity-0"
                        style={{
                          transitionDelay: `${idx * 150}ms`,
                          opacity: visibleCards.has(baseIndex + idx) ? 1 : 0,
                          transform: visibleCards.has(baseIndex + idx)
                            ? "translateY(0) scale(1)"
                            : "translateY(2rem) scale(0.95)",
                          transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      >
                        <div className="group relative h-full">
                          {/* Colored glow variations */}
                          <div
                            className={`absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500 ${
                              idx % 3 === 0
                                ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                                : idx % 3 === 1
                                  ? "bg-gradient-to-r from-purple-500 to-pink-500"
                                  : "bg-gradient-to-r from-blue-500 to-purple-500"
                            }`}
                          />

                          {/* Glass card */}
                          <div className="relative h-full bg-gray-800/30 backdrop-blur-2xl border border-gray-700/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:border-cyan-500/50 transition-all duration-500 hover:-translate-y-2 active:translate-y-0">
                            <div className="absolute inset-0 rounded-3xl shadow-inner opacity-50" />

                            {/* Raised effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative">
                              <ProjectCard {...proj} />
                            </div>

                            {/* Micro-interaction indicator */}
                            <div className="absolute top-6 right-6 w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              });
            })()}
          </div>

          {/* Bottom CTA Section - Dark Theme */}
          <div className="text-center py-24 mt-24">
            <div className="relative inline-block">
              {/* Animated gradient background */}
              <div className="absolute -inset-8 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-3xl blur-3xl opacity-30 animate-pulse" />

              {/* Main CTA card */}
              <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-2xl border-2 border-cyan-500/50 rounded-3xl px-12 sm:px-16 py-12 sm:py-16 shadow-2xl max-w-3xl">
                {/* Raised effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl" />

                <div className="relative">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-20 h-20 mb-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl shadow-2xl shadow-cyan-500/50 hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>

                  {/* Headline */}
                  <h3 className="text-3xl sm:text-4xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Ready to Start Your Project?
                  </h3>

                  {/* Description */}
                  <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-xl mx-auto leading-relaxed">
                    Let's collaborate and transform your vision into an
                    exceptional digital reality
                  </p>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <button className="group relative px-10 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full font-bold text-lg text-white overflow-hidden shadow-2xl hover:shadow-cyan-500/50 transition-all duration-500 hover:scale-105 active:scale-95">
                      <span className="relative z-10 flex items-center gap-3">
                        Start a Project
                        <svg
                          className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </button>

                    <button className="group px-10 sm:px-12 py-4 sm:py-5 bg-transparent border-2 border-cyan-500/50 rounded-full font-semibold text-lg text-white hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300 hover:scale-105 active:scale-95">
                      <span className="flex items-center gap-3">
                        View Services
                        <svg
                          className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
