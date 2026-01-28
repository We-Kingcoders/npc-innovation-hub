import { useState } from "react";
import { Link } from "react-router-dom";

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
 *
 * Updates:
 * - Reduced diagonal angle for softer transition
 * - Navy background pushed further right
 * - Slogan repositioned directly under hero image
 */

const HeroSection = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          NAVIGATION BAR
          ================================================================= */}

      <header className="relative z-10">
        {/* Mobile Navigation */}
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-gray-100">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <Link to="/" className="font-bold text-xl text-[#002B56]">
              NpcInnovationHub
            </Link>

            {/* Hamburger Menu Button */}
            <button
              className="relative p-2 text-[#002B56] hover:bg-gray-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00A0E3]/20"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              <div className="w-6 h-6 relative">
                <span
                  className={`absolute block w-6 h-0.5 bg-[#002B56] transform transition-all duration-300 ${
                    isMenuOpen ? "rotate-45 top-2.5" : "top-0"
                  }`}
                />
                <span
                  className={`absolute block w-6 h-0.5 bg-[#002B56] top-2.5 transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute block w-6 h-0.5 bg-[#002B56] transform transition-all duration-300 ${
                    isMenuOpen ? "-rotate-45 top-2.5" : "top-5"
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <nav className="px-6 pb-4 bg-gradient-to-b from-white to-gray-50 border-t border-gray-100">
              <div className="space-y-1 pt-2">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 text-[#002B56] font-medium rounded-lg bg-[#ECF7FC] border-l-4 border-[#00A0E3] hover:bg-[#E0F2FE] transition-colors duration-200"
                >
                  <span>Home</span>
                  <svg
                    className="w-5 h-5 text-[#00A0E3]"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link
                  to="/abouthub"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 text-[#002B56] font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <span>AboutHub</span>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link
                  to="/members"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 text-[#002B56] font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <span>Members</span>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link
                  to="/projects"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 text-[#002B56] font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <span>Projects</span>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block mt-4 text-center bg-white text-[#002B56] font-semibold px-6 py-3 rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                >
                  Sign In
                </Link>
              </div>
            </nav>
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-between px-16 xl:px-24 pt-6 pb-4">
          {/* Logo */}
          <Link
            to="/"
            className="font-bold text-[1.75rem] xl:text-[2rem] text-[#002B56] hover:text-[#003366] transition-colors duration-200"
          >
            NpcInnovationHub
          </Link>

          {/* Navigation Links */}
          <nav
            className="flex items-center gap-8 xl:gap-10"
            role="navigation"
            aria-label="Main navigation"
          >
            <Link
              to="/"
              className="relative text-[#00A0E3] font-semibold text-[1.125rem] xl:text-[1.25rem] hover:text-[#0090d0] transition-colors duration-200 pb-1 border-b-2 border-[#00A0E3]"
              aria-current="page"
            >
              Home
            </Link>
            <Link
              to="/abouthub"
              className="text-[#002B56] font-medium text-[1.125rem] xl:text-[1.25rem] hover:text-[#00A0E3] transition-colors duration-200"
            >
              AboutHub
            </Link>
            <Link
              to="/members"
              className="text-[#002B56] font-medium text-[1.125rem] xl:text-[1.25rem] hover:text-[#00A0E3] transition-colors duration-200"
            >
              Members
            </Link>
            <Link
              to="/projects"
              className="text-[#002B56] font-medium text-[1.125rem] xl:text-[1.25rem] hover:text-[#00A0E3] transition-colors duration-200"
            >
              Projects
            </Link>
          </nav>

          {/* Sign In Button */}
          <Link
            to="/login"
            className="bg-white text-[#002B56] font-semibold px-8 py-2.5 rounded-full shadow-md text-[1.125rem] border border-gray-200 hover:bg-gray-50 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00A0E3] focus:ring-offset-2"
          >
            Sign In
          </Link>
        </div>
      </header>

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
            >
              Join Us
            </button>
          </div>
        </section>

        {/* Right Section - Hero Image + Slogan Container */}
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default HeroSection;
