// import React from "react";
import ProjectCard from "../../components/projects/ProjectCard";
import {
  projects,
  featuredProject,
  allProjects,
} from "../../data/projectsData";
import ProjectsHighlightSection from "../../components/projects/ProjectsHighlightSection";

const ProjectsPage = () => {
  // Custom chunking logic for the allProjects layout
  const rowPattern = [2, 3, 3, 2];
  const chunkedProjects = [];
  let i = 0;
  let patternIndex = 0;

  while (i < allProjects.length) {
    const chunkSize = rowPattern[patternIndex % rowPattern.length];
    chunkedProjects.push(allProjects.slice(i, i + chunkSize));
    i += chunkSize;
    patternIndex++;
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="text-center pt-10 sm:pt-16 px-2 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-medium text-blue-950 mb-3 sm:mb-5">
          Explore our Projects
        </h1>
        <p className="max-w-xl mx-auto text-gray-700 mb-6 sm:mb-8 text-sm sm:text-base">
          Discover how we turn ideas into impactful digital experiences. Our
          projects reflect a blend of strategic thinking, modern design, and
          technical excellence.
        </p>
      </div>

      {/* Top Project Cards */}
      <div className="flex flex-col md:flex-row gap-6 sm:gap-8 justify-center px-2 sm:px-3 md:px-0 mb-10 sm:mb-16">
        {projects.slice(0, 2).map((proj) => (
          <div className="flex-1 max-w-md w-full" key={proj.id}>
            <ProjectCard {...proj} />
          </div>
        ))}
      </div>

      {/* Featured Projects */}
      <div className="text-center my-10 sm:my-14 px-2 sm:px-0">
        <h2 className="text-2xl sm:text-3xl font-medium text-blue-950 mb-3 sm:mb-5">
          Featured Projects
        </h2>
        <p className="max-w-xl mx-auto text-gray-700 mb-6 sm:mb-8 text-sm sm:text-base">
          Explore a selection of our most impactful and innovative work. Each
          project showcases our commitment to quality, creativity, and
          real-world results.
        </p>

        <div className="flex justify-center">
          <div className="w-full max-w-[928px]">
            <ProjectCard {...featuredProject} variant="featured" />
          </div>
        </div>
      </div>

      {/* 30+ Projects Section */}
      <ProjectsHighlightSection
        projects={projects}
        onExploreAll={() => {
          /* handle navigation to all projects section/page */
        }}
      />

      {/* All Projects */}
      <div className="text-center my-10 sm:my-16">
        <h2 className="text-2xl sm:text-3xl font-medium text-blue-950 mb-8 sm:mb-10">
          All Projects
        </h2>
        <div className="flex flex-col gap-6 sm:gap-8 px-2">
          {(() => {
            const rowPattern = [2, 3, 3, 2];
            const chunked = [];
            let i = 0;
            let patternIndex = 0;

            while (i < allProjects.length) {
              const size = rowPattern[patternIndex % rowPattern.length];
              chunked.push(allProjects.slice(i, i + size));
              i += size;
              patternIndex++;
            }

            return chunked.map((row, rowIndex) => {
              if (row.length === 2) {
                return (
                  <div
                    className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center px-2 sm:px-3 md:px-0"
                    key={rowIndex}
                  >
                    {row.map((proj) => (
                      <div className="flex-1 max-w-md w-full" key={proj.id}>
                        <ProjectCard {...proj} />
                      </div>
                    ))}
                  </div>
                );
              }

              // If row.length === 3 (or more)
              return (
                <div
                  className="flex flex-col sm:flex-row justify-center flex-wrap gap-6 sm:gap-8 w-full max-w-[928px] mx-auto"
                  key={rowIndex}
                >
                  {row.map((proj) => (
                    <div
                      className="w-full sm:w-72 md:w-72 lg:w-72"
                      key={proj.id}
                    >
                      <ProjectCard {...proj} />
                    </div>
                  ))}
                </div>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
