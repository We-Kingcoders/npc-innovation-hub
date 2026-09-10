type ProjectHeroProps = {
  onViewProjectsClick: () => void;
};

const ProjectHero = ({ onViewProjectsClick }: ProjectHeroProps) => {
  return (
    <div className="w-full min-h-screen bg-white relative overflow-hidden flex flex-col">
      {/* =================================================================
          BACKGROUND DESIGN - Subtle Diagonal Split
          ================================================================= */}

      {/* Desktop: Subtle Diagonal Navy Background (pushed right with less steep angle) */}
      <div
        className="hidden lg:block absolute top-0 right-0 h-full w-[55%] bg-[#002B56] z-0"
        style={{
          clipPath: "polygon(53% 0, 100% 0, 100% 100%, 0% 100%)",
        }}
      />

      {/* Mobile/Tablet: Gradient Header Background */}
      <div className="lg:hidden absolute inset-0 z-0">
        {/* Top gradient section */}
        <div className="relative h-48 bg-gradient-to-r from-[#002B56] to-[#00A0E3]">
          {/* Mobile tagline in blue section */}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-2xl sm:text-3xl font-bold select-none text-center">
              <span className="text-white block">Innovate.</span>
              <span className="text-white/90 block">Create.</span>
              <span className="text-white/80 block">Lead.</span>
            </p>
          </div>
        </div>

        {/* Decorative geometric elements */}
        <div className="absolute top-0 right-0 w-full h-64 pointer-events-none">
          <div className="absolute top-8 right-8 w-24 h-24 bg-white/10 rounded-full" />
          <div className="absolute top-16 right-16 w-16 h-16 bg-white/5 rounded-full" />
          <div className="absolute top-24 right-4 w-8 h-8 bg-white/15 rounded-full" />
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00A0E3] to-transparent" />
      </div>

      {/* =================================================================
          MAIN HERO CONTENT
          ================================================================= */}

      {/* A <div>, not <main> - this only covers the hero, not the rest of
          /projects's content, which renders as later siblings in
          ProjectsPage.tsx. The single <main id="main-content"> that covers
          the whole page lives in AllRoutes.tsx. */}
      <div className="flex-1 flex flex-col lg:flex-row relative z-10 items-center lg:items-start">
        {/* Left Section - Hero Text Content */}
        <section className="flex flex-col justify-center w-full px-6 sm:px-8 pt-8 pb-8 lg:w-[40%] lg:pl-16 xl:pl-24 lg:pr-8 lg:pt-20">
          {/* Main Headline */}
          <h1 className="text-[#29476E] font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem] leading-tight mb-6 tracking-tight">
            Empowering
            <br />
            Developers,
            <br />
            Driving
            <br />
            Innovation.
          </h1>

          {/* Supporting Text */}
          <p className="text-[#283D4B] text-lg sm:text-xl lg:text-[1.25rem] font-normal leading-relaxed mb-8 max-w-md">
            A student-led space for creating innovative, real-world tech
            solutions.
          </p>

          {/* Call-to-Action Button */}
          <div>
            <button
              onClick={onViewProjectsClick}
              className="rounded-full border-2 border-[#00A0E3] text-[#00A0E3] px-10 py-3 font-semibold text-lg lg:text-[1.2rem] hover:bg-[#00A0E3] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#00A0E3] focus:ring-offset-2"
              aria-label="View Projects"
            >
              View Projects
            </button>
          </div>
        </section>

        {/* Right Section - Hero Image Carousel + Slogan Container */}
        <div className="hidden lg:flex flex-col items-start justify-center w-full lg:w-[60%] lg:pl-12 xl:pl-20 lg:pr-16 xl:pr-24 lg:pt-20">
          {/* Hero Image */}
          <div className="rounded-2xl overflow-hidden shadow-2xl w-full max-w-[580px] h-[420px] xl:h-[470px]">
            <img
              src="/assets/images/hero.png"
              alt="Smiling developer working on laptop in modern office environment"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
          {/* Slogan - Positioned directly below image */}
          <div className="mt-2 xl:mt-10 w-full max-w-[580px] text-right">
            <p className="text-[2rem] xl:text-[2.5rem] font-bold select-none leading-tight">
              <span className="text-[#000000]">Innovate.</span>{" "}
              <span className="text-[#00A0E3]">Create.</span>
              <br />
              <span className="text-[#00A0E3]">Lead.</span>
            </p>
          </div>{" "}
        </div>
      </div>
    </div>
  );
};

export default ProjectHero;
