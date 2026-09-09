import { useState, useEffect } from "react";
import JoinUsModal from "../../components/JoinUsModal";
import { useHeroMembers } from "../../hooks/useHeroMembers";

/**
 * HeroSection Component
 *
 * Production-ready hero section for NpcInnovationHub landing page
 * Matches reference design with pixel-perfect accuracy
 *
 * Features:
 * - Subtle diagonal split background (white left, navy right)
 * - Responsive navigation with hamburger menu
 * - Two-column layout with hero text and image
 * - "Innovate. Create. Lead." tagline positioned below hero image
 * - Fully accessible and mobile-responsive
 * - Automatic sliding carousel of 12 team members
 *
 * Updates:
 * - Reduced diagonal angle for softer transition
 * - Navy background pushed further right
 * - Slogan repositioned directly under hero image
 * - Added team member carousel with auto-loop
 */

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const { members: heroMembers } = useHeroMembers();

  const teamMembers = heroMembers.map((hm) => ({
    name: hm.name,
    role: hm.role,
    image: hm.imageUrl ?? "/assets/images/hero.png",
  }));

  // Automatic looping
  useEffect(() => {
    if (teamMembers.length === 0) return undefined;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % teamMembers.length);
    }, 3500); // Change slide every 3.5 seconds

    return () => clearInterval(timer);
  }, [teamMembers.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    if (teamMembers.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % teamMembers.length);
  };

  const prevSlide = () => {
    if (teamMembers.length === 0) return;
    setCurrentSlide(
      (prev) => (prev - 1 + teamMembers.length) % teamMembers.length,
    );
  };

  return (
    <div
      id="home"
      className="w-full min-h-screen relative overflow-hidden flex flex-col scroll-mt-16 lg:scroll-mt-20"
    >
      <JoinUsModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
      {/* =================================================================
          FIXED PARALLAX BACKGROUND - stays pinned to the viewport while the
          hero's own foreground content (text, image carousel) scrolls/moves
          over it, instead of scrolling together as one flat image. Sits
          under a near-opaque white wash so foreground text (dark navy on
          white) stays fully readable - the image just gives the hero subtle
          depth rather than being a busy visible photo.
          ================================================================= */}
      <div
        className="absolute inset-0 z-0 bg-fixed bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/images/hero.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 z-0 bg-white/90" aria-hidden="true" />

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

      <main className="flex-1 flex flex-col lg:flex-row relative z-10 items-center lg:items-start">
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
              className="rounded-full border-2 border-[#00A0E3] text-[#00A0E3] px-10 py-3 font-semibold text-lg lg:text-[1.2rem] hover:bg-[#00A0E3] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#00A0E3] focus:ring-offset-2"
              aria-label="Join NpcInnovationHub"
              onClick={() => setIsJoinModalOpen(true)}
            >
              Join Us
            </button>
          </div>
        </section>

        {/* Right Section - Hero Image Carousel + Slogan Container */}
        <div className="hidden lg:flex flex-col items-start justify-center w-full lg:w-[60%] lg:pl-12 xl:pl-20 lg:pr-16 xl:pr-24 lg:pt-20">
          {/* Hero Image Carousel */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl w-full max-w-[580px] h-[420px] xl:h-[470px]">
            {/* Slides */}
            <div className="relative w-full h-full">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={member.image}
                    alt={`${member.name} - ${member.role}`}
                    className="w-full h-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  {/* Text overlay with gradient */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 pb-20">
                    <h3 className="text-white text-2xl font-bold mb-1 drop-shadow-lg">
                      {member.name}
                    </h3>
                    <p className="text-gray-200 text-lg drop-shadow-md">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation dots */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
              {teamMembers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-white w-8 h-2.5"
                      : "bg-white/50 hover:bg-white/75 w-2.5 h-2.5"
                  } rounded-full`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Arrow navigation */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-3 transition-all duration-300 z-10"
              aria-label="Previous slide"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-3 transition-all duration-300 z-10"
              aria-label="Next slide"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Slogan - Positioned directly below image */}
          <div className="mt-2 xl:mt-10 w-full max-w-[580px] text-right">
            <p className="text-[2rem] xl:text-[2.5rem] font-bold select-none leading-tight">
              <span className="text-[#000000]">Innovate.</span>{" "}
              <span className="text-[#00A0E3]">Create.</span>
              <br />
              <span className="text-[#00A0E3]">Lead.</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HeroSection;
