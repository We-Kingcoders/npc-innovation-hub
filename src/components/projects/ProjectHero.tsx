// import { useState } from "react";

// import { Link } from "react-router-dom";
// type ProjectHeroProps = {
//   onViewProjectsClick: () => void;
// };

// const ProjectHero = ({ onViewProjectsClick }: ProjectHeroProps) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   return (
//     <>
//       <div className="w-full min-h-screen bg-white relative overflow-hidden flex flex-col">
//         {/* Background Design */}
//         {/* Desktop: Original Diagonal Blue Background */}
//         <div
//           className="hidden lg:block absolute top-0 right-0 h-full w-[58vw] bg-[#002B56] z-0"
//           style={{
//             clipPath: "polygon(22vw 0, 100% 0, 100% 100%, 0% 100%)",
//           }}
//         ></div>

//         {/* Mobile/Tablet: Professional Background Design */}
//         <div className="lg:hidden absolute inset-0 z-0">
//           {/* Top gradient header with text */}
//           <div className="relative h-48 bg-gradient-to-r from-[#002B56] to-[#00A0E3]">
//             {/* Innovate Create Lead text in blue section */}
//           </div>

//           {/* Subtle geometric accent */}
//           <div className="absolute top-0 right-0 w-full h-64">
//             <div className="absolute top-8 right-8 w-24 h-24 bg-white/10 rounded-full"></div>
//             <div className="absolute top-16 right-16 w-16 h-16 bg-white/5 rounded-full"></div>
//             <div className="absolute top-24 right-4 w-8 h-8 bg-white/15 rounded-full"></div>
//           </div>

//           {/* Bottom accent line */}
//           <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00A0E3] to-transparent"></div>
//         </div>

//         {/* Navigation */}
//         <header className="relative z-10">
//           {/* Mobile Navigation Header */}
//           <div className="lg:hidden bg-white/90 backdrop-blur-md border-b border-[#E5EAF2]/50">
//             <div className="flex items-center justify-between px-4 sm:px-6 py-4">
//               <div className="font-bold text-lg sm:text-xl text-[#002B56]">
//                 NpcInnovationHub
//               </div>

//               {/* Mobile Menu Button */}
//               <button
//                 className="relative p-2 text-[#002B56] hover:bg-[#F8FAFC] rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00A0E3]/20"
//                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 aria-label="Toggle menu"
//               >
//                 <div className="w-6 h-6 relative">
//                   <span
//                     className={`absolute block w-6 h-0.5 bg-[#002B56] transform transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2.5" : "translate-y-0"}`}
//                   ></span>
//                   <span
//                     className={`absolute block w-6 h-0.5 bg-[#002B56] transform transition-all duration-300 translate-y-2.5 ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
//                   ></span>
//                   <span
//                     className={`absolute block w-6 h-0.5 bg-[#002B56] transform transition-all duration-300 translate-y-5 ${isMenuOpen ? "-rotate-45 -translate-y-2.5" : "translate-y-0"}`}
//                   ></span>
//                 </div>
//               </button>
//             </div>

//             {/* Mobile Menu Dropdown */}
//             <nav className="px-4 sm:px-6 pb-4 bg-gradient-to-b from-white to-[#F8FAFC]">
//               <div className="space-y-1">
//                 <Link
//                   to="/"
//                   onClick={() => setIsMenuOpen(false)}
//                   className="flex items-center px-4 py-3 text-[#002B56] font-medium rounded-lg bg-[#ECF7FC] border-l-4 border-[#00A0E3] hover:bg-[#E0F2FE] transition-colors duration-200"
//                 >
//                   <span>Home</span>
//                   <svg
//                     className="ml-auto w-4 h-4 text-[#00A0E3]"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </Link>

//                 <Link
//                   to="/abouthub"
//                   onClick={() => setIsMenuOpen(false)}
//                   className="flex items-center px-4 py-3 text-[#002B56] font-medium rounded-lg hover:bg-[#F8FAFC] transition-colors duration-200"
//                 >
//                   <span>AboutHub</span>
//                   <svg
//                     className="ml-auto w-4 h-4 text-gray-400"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </Link>

//                 <Link
//                   to="/members"
//                   onClick={() => setIsMenuOpen(false)}
//                   className="flex items-center px-4 py-3 text-[#002B56] font-medium rounded-lg hover:bg-[#F8FAFC] transition-colors duration-200"
//                 >
//                   <span>Members</span>
//                   <svg
//                     className="ml-auto w-4 h-4 text-gray-400"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </Link>

//                 <Link
//                   to="/projects"
//                   onClick={() => setIsMenuOpen(false)}
//                   className="flex items-center px-4 py-3 text-[#002B56] font-medium rounded-lg hover:bg-[#F8FAFC] transition-colors duration-200"
//                 >
//                   <span>Projects</span>
//                   <svg
//                     className="ml-auto w-4 h-4 text-gray-400"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </Link>
//               </div>
//               {/* Sign In button unchanged */}
//             </nav>
//           </div>

//           {/* Desktop Navigation - preserved original styling */}
//           <div className="hidden lg:flex items-center justify-between px-24 pt-8 pb-2">
//             <div className="font-bold text-[2rem] text-[#002B56]">
//               NpcInnovationHub
//             </div>
//             <nav className="flex items-center space-x-4 ml-64">
//               <Link
//                 to="/"
//                 className="text-[#002B56] font-medium px-3 py-1 text-[1.25rem] hover:text-[#00A0E3] focus:text-[#00A0E3] border-b-2 border-[#00A0E3]"
//               >
//                 Home
//               </Link>
//               <Link
//                 to="/abouthub"
//                 className="text-[#002B56] font-medium px-3 py-1 text-[1.25rem] hover:text-[#00A0E3] focus:text-[#00A0E3]"
//               >
//                 AboutHub
//               </Link>
//               <Link
//                 to="/members"
//                 className="text-[#002B56] font-medium px-3 py-1 text-[1.25rem] hover:text-[#00A0E3] focus:text-[#00A0E3]"
//               >
//                 Members
//               </Link>
//               <Link
//                 to="/projects"
//                 className="text-[#002B56] font-medium px-3 py-1 text-[1.25rem] hover:text-[#00A0E3] focus:text-[#00A0E3]"
//               >
//                 Projects
//               </Link>
//             </nav>

//             <button className="ml-auto bg-white text-[#002B56] font-semibold px-6 py-2 rounded-full shadow text-[1.125rem] border border-[#E5EAF2] hover:bg-[#f2f7fb] transition">
//               Sign In
//             </button>
//           </div>
//         </header>

//         {/* Main Layout */}
//         <main className="flex-1 flex relative z-10">
//           {/* Left Section - preserved original desktop styling */}
//           <section className="flex flex-col justify-center w-full px-4 sm:px-8 pt-8 pb-8 lg:w-[44vw] lg:pl-[5vw] lg:pt-[3vw] lg:pb-[3vw]">
//             <p className="mt-2 text-[#283D4B] text-base sm:text-lg lg:text-[1.15rem] font-normal mb-7 lg:max-w-[400px]">
//               A student-led space for creating
//               <br className="hidden lg:block" />
//               innovative, real-world tech
//               <br className="hidden lg:block" />
//               solutions.
//             </p>
//             <p>
//               <button
//                 onClick={onViewProjectsClick}
//                 className="rounded-full border border-[#00A0E3] text-[#00A0E3] px-6 sm:px-8 py-2 mt-4 font-semibold text-base sm:text-lg lg:text-[1.1rem] hover:bg-[#ECF7FC] transition shadow-sm"
//               >
//                 View Projects
//               </button>
//             </p>
//           </section>

//           {/* Center Image - preserved original desktop positioning only */}
//           <div className="hidden lg:block absolute left-[42vw] top-[5vw] z-20">
//             <div className="rounded-[18px] overflow-hidden shadow-lg w-[798px] h-[650px]">
//               <img
//                 src="/public/assets/images/hero.png"
//                 alt="Developer working on laptop"
//                 className="w-full h-full object-cover"
//                 draggable={false}
//               />
//             </div>
//           </div>
//         </main>
//       </div>
//     </>
//   );
// };

// export default ProjectHero;

import { useState } from "react";
import { Link } from "react-router-dom";

type ProjectHeroProps = {
  onViewProjectsClick: () => void;
};

const ProjectHero = ({ onViewProjectsClick }: ProjectHeroProps) => {
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
                  className="flex items-center justify-between px-4 py-3 text-[#002B56] font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <span>Home</span>
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

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onViewProjectsClick();
                  }}
                  className="flex items-center justify-between px-4 py-3 text-[#002B56] font-medium rounded-lg bg-[#ECF7FC] border-l-4 border-[#00A0E3] hover:bg-[#E0F2FE] transition-colors duration-200 w-full"
                >
                  <span>Projects</span>
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
                </button>

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
              className="text-[#002B56] font-medium text-[1.125rem] xl:text-[1.25rem] hover:text-[#00A0E3] transition-colors duration-200"
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
            <button
              onClick={onViewProjectsClick}
              className="relative text-[#00A0E3] font-semibold text-[1.125rem] xl:text-[1.25rem] hover:text-[#0090d0] transition-colors duration-200 pb-1 border-b-2 border-[#00A0E3]"
            >
              Projects
            </button>
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
      </main>
    </div>
  );
};

export default ProjectHero;
