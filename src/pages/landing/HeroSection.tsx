import { useState } from "react";

import { Link } from "react-router-dom";

const HeroSection = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="w-full min-h-screen bg-white relative overflow-hidden flex flex-col">
      {/* Background Design */}
      {/* Desktop: Original Diagonal Blue Background */}
      <div
        className="hidden lg:block absolute top-0 right-0 h-full w-[58vw] bg-[#002B56] z-0"
        style={{
          clipPath: "polygon(22vw 0, 100% 0, 100% 100%, 0% 100%)",
        }}
      ></div>

      {/* Mobile/Tablet: Professional Background Design responsiveness*/}
      <div className="lg:hidden absolute inset-0 z-0">
        {/* Top gradient header with text */}
        <div className="relative h-48 bg-gradient-to-r from-[#002B56] to-[#00A0E3]">
          {/* Innovate Create Lead text in blue section */}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-2xl sm:text-3xl font-bold select-none text-center">
              <span className="text-white block">Innovate.</span>
              <span className="text-white/90 block">Create.</span>
              <span className="text-white/90 block">Lead.</span>
            </p>
          </div>
        </div>

        {/* Subtle geometric accent */}
        <div className="absolute top-0 right-0 w-full h-64">
          <div className="absolute top-8 right-8 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute top-16 right-16 w-16 h-16 bg-white/5 rounded-full"></div>
          <div className="absolute top-24 right-4 w-8 h-8 bg-white/15 rounded-full"></div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00A0E3] to-transparent"></div>
      </div>

      {/* Navigation */}
      <header className="relative z-10">
        {/* Mobile Navigation Header */}
        <div className="lg:hidden bg-white/90 backdrop-blur-md border-b border-[#E5EAF2]/50">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="font-bold text-lg sm:text-xl text-[#002B56]">
              NpcInnovationHub
            </div>

            {/* Mobile Menu Button */}
            <button
              className="relative p-2 text-[#002B56] hover:bg-[#F8FAFC] rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00A0E3]/20"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 relative">
                <span
                  className={`absolute block w-6 h-0.5 bg-[#002B56] transform transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2.5" : "translate-y-0"}`}
                ></span>
                <span
                  className={`absolute block w-6 h-0.5 bg-[#002B56] transform transition-all duration-300 translate-y-2.5 ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
                ></span>
                <span
                  className={`absolute block w-6 h-0.5 bg-[#002B56] transform transition-all duration-300 translate-y-5 ${isMenuOpen ? "-rotate-45 -translate-y-2.5" : "translate-y-0"}`}
                ></span>
              </div>
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          <nav className="px-4 sm:px-6 pb-4 bg-gradient-to-b from-white to-[#F8FAFC]">
            <div className="space-y-1">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center px-4 py-3 text-[#002B56] font-medium rounded-lg bg-[#ECF7FC] border-l-4 border-[#00A0E3] hover:bg-[#E0F2FE] transition-colors duration-200"
              >
                <span>Home</span>
                <svg
                  className="ml-auto w-4 h-4 text-[#00A0E3]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>

              <Link
                to="/abouthub"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center px-4 py-3 text-[#002B56] font-medium rounded-lg hover:bg-[#F8FAFC] transition-colors duration-200"
              >
                <span>AboutHub</span>
                <svg
                  className="ml-auto w-4 h-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>

              <Link
                to="/members"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center px-4 py-3 text-[#002B56] font-medium rounded-lg hover:bg-[#F8FAFC] transition-colors duration-200"
              >
                <span>Members</span>
                <svg
                  className="ml-auto w-4 h-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>

              <Link
                to="/projects"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center px-4 py-3 text-[#002B56] font-medium rounded-lg hover:bg-[#F8FAFC] transition-colors duration-200"
              >
                <span>Projects</span>
                <svg
                  className="ml-auto w-4 h-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
            {/* Sign In button unchanged */}
          </nav>
        </div>

        {/* Desktop Navigation - preserved original styling */}
        <div className="hidden lg:flex items-center justify-between px-24 pt-8 pb-2">
          <div className="font-bold text-[2rem] text-[#002B56]">
            NpcInnovationHub
          </div>
          <nav className="flex items-center space-x-4 ml-64">
            <Link
              to="/"
              className="text-[#002B56] font-medium px-3 py-1 text-[1.25rem] hover:text-[#00A0E3] focus:text-[#00A0E3] border-b-2 border-[#00A0E3]"
            >
              Home
            </Link>
            <Link
              to="/abouthub"
              className="text-[#002B56] font-medium px-3 py-1 text-[1.25rem] hover:text-[#00A0E3] focus:text-[#00A0E3]"
            >
              AboutHub
            </Link>
            <Link
              to="/members"
              className="text-[#002B56] font-medium px-3 py-1 text-[1.25rem] hover:text-[#00A0E3] focus:text-[#00A0E3]"
            >
              Members
            </Link>
            <Link
              to="/projects"
              className="text-[#002B56] font-medium px-3 py-1 text-[1.25rem] hover:text-[#00A0E3] focus:text-[#00A0E3]"
            >
              Projects
            </Link>
          </nav>
          <Link
            to="/login"
            className="ml-auto bg-white text-[#002B56] font-semibold px-6 py-2 rounded-full shadow text-[1.125rem] border border-[#E5EAF2] hover:bg-[#f2f7fb] transition"
          >
            Sign In
          </Link>

          {/* <button className="ml-auto bg-white text-[#002B56] font-semibold px-6 py-2 rounded-full shadow text-[1.125rem] border border-[#E5EAF2] hover:bg-[#f2f7fb] transition">
            Sign In
          </button> */}
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex relative z-10">
        {/* Left Section - preserved original desktop styling */}
        <section className="flex flex-col justify-center w-full px-4 sm:px-8 pt-8 pb-8 lg:w-[44vw] lg:pl-[5vw] lg:pt-[3vw] lg:pb-[3vw]">
          <h1 className="text-[#29476E] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[2.4rem] xl:text-[2.7rem] leading-tight mb-3 tracking-tight">
            Empowering
            <br />
            Developers,
            <br />
            Driving
            <br />
            Innovation.
          </h1>
          <p className="mt-2 text-[#283D4B] text-base sm:text-lg lg:text-[1.15rem] font-normal mb-7 lg:max-w-[400px]">
            A student-led space for creating
            <br className="hidden lg:block" />
            innovative, real-world tech
            <br className="hidden lg:block" />
            solutions.
          </p>
          <p>
            <button className="rounded-full border border-[#00A0E3] text-[#00A0E3] px-6 sm:px-8 py-2 font-semibold text-base sm:text-lg lg:text-[1.1rem] hover:bg-[#ECF7FC] transition shadow-sm">
              Join Us
            </button>
          </p>
        </section>

        {/* Center Image - preserved original desktop positioning only */}
        <div className="hidden lg:block absolute left-[42vw] top-[5vw] z-20">
          <div className="rounded-[18px] overflow-hidden shadow-lg w-[798px] h-[650px]">
            <img
              src="/public/assets/images/hero.png"
              alt="Developer working on laptop"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        </div>

        {/* Bottom Right Text - preserved original desktop styling */}
        <div className="hidden lg:block absolute right-[5vw] bottom-[5vw] z-30 text-right">
          <p className="text-[2.2rem] xl:text-[2.7rem] font-bold select-none">
            <span className="text-[#002B56] pr-24">Innovate.</span>
            <span className="text-[#00A0E3]">Create.</span>
            <br />
            <span className="text-[#00A0E3]">Lead.</span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default HeroSection;
