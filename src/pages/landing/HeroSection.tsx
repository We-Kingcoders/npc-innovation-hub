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
 * - Left column also rotates through 4 headline/subtext messages,
 *   independently of the member photo carousel on the right
 *
 * Updates:
 * - Reduced diagonal angle for softer transition
 * - Navy background pushed further right
 * - Slogan repositioned directly under hero image
 * - Added team member carousel with auto-loop
 * - Member photos now render as uniform large circular avatars
 * - Navy diagonal widened further for full coverage behind the card,
 *   which is now right-aligned flush against the viewport's right edge
 */

// Four angles on what the Hub actually offers - mentorship, real shipped
// projects, and the Hire Us/alumni career pipeline - rather than one
// static line repeating the same pitch forever. Deliberately kept
// independent from the member photo carousel on the right: that list is
// admin-managed (via Hero Members) and can be any length including
// zero, so coupling the two 1:1 would break the moment it changes.
const HERO_SLIDES = [
  {
    headline: "Empowering Developers, Driving Innovation.",
    text: "A student-led space for creating innovative, real-world tech solutions.",
  },
  {
    headline: "Where Students Become Builders.",
    text: "Join a community of student developers turning classroom ideas into real, working software - with mentorship every step of the way.",
  },
  {
    headline: "From First Line of Code to Finished Project.",
    text: "Ship real projects, build a portfolio that matters, and grow the skills employers are actually looking for.",
  },
  {
    headline: "Innovation With a Career Path.",
    text: "Learn alongside a growing alumni network, get discovered through Hire Us, and turn your Hub experience into your next opportunity.",
  },
];

const TEXT_SLIDE_INTERVAL_MS = 3000;
const FADE_DURATION_MS = 300;

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const [textSlide, setTextSlide] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const [textPaused, setTextPaused] = useState(false);

  const changeTextSlide = (index: number) => {
    setTextVisible(false);
    setTimeout(() => {
      setTextSlide(index);
      setTextVisible(true);
    }, FADE_DURATION_MS);
  };

  const nextTextSlide = () =>
    changeTextSlide((textSlide + 1) % HERO_SLIDES.length);

  // Re-arms on every slide change, whether that came from this timer or
  // a manual dot click - so jumping ahead doesn't get immediately
  // overridden by a tick that was already mid-countdown.
  useEffect(() => {
    if (textPaused) return undefined;
    const timer = setInterval(nextTextSlide, TEXT_SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textSlide, textPaused]);

  const { members: heroMembers } = useHeroMembers();

  const teamMembers = heroMembers.map((hm) => ({
    name: hm.name,
    role: hm.role,
    image: hm.imageUrl ?? "/assets/images/hero.png",
  }));

  // The hero member list now refreshes in the background (see
  // useHeroMembers) so an admin's changes show up without a page
  // reload - which means it can shrink while a visitor is mid-carousel.
  // Without this, an in-range currentSlide could point past the end of
  // a newly-shorter list and every slide would render opacity-0 until
  // the interval below happened to wrap back into range.
  useEffect(() => {
    if (teamMembers.length > 0 && currentSlide >= teamMembers.length) {
      setCurrentSlide(0);
    }
  }, [teamMembers.length, currentSlide]);

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

  return (
    <div
      id="home"
      className="w-full min-h-screen bg-white relative overflow-hidden flex flex-col scroll-mt-16 lg:scroll-mt-20"
    >
      <JoinUsModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
      {/* =================================================================
          BACKGROUND DESIGN - Subtle Diagonal Split
          Pure white left / pure navy right, no background photo - a
          background-image layer was tried here for a parallax effect, but
          it washed out the flat white/navy this design is meant to have
          (compare: the diagonal navy panel right below is a plain color,
          not a photo).
          ================================================================= */}

      {/* Desktop: Diagonal Navy Background. Widened further and the
          diagonal flattened so the navy fully backs the member-carousel
          card - including the space around it, not just the card's own
          opaque fill - at every height, with only a shallow diagonal
          accent left near the very top. The bottom-left corner
          (100% - 65% = 35%) still clears the 40%-wide text column on the
          left with a safety margin, so this much bigger panel never
          bleeds navy behind the rotating headline text. */}
      <div
        className="hidden lg:block absolute top-0 right-0 h-full w-[65%] bg-[#002B56] z-0"
        style={{
          clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)",
        }}
      />

      {/* Mobile/Tablet: Gradient Header Background */}
      <div className="lg:hidden absolute inset-0 z-0">
        {/* Top gradient section */}
        <div className="relative h-48 bg-gradient-to-r from-[#002B56] to-[#003366]">
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

        {/* Bottom accent line - white, not the old light blue, so it still
            reads as a highlight against this now-all-navy gradient rather
            than disappearing into it. */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>

      {/* =================================================================
          MAIN HERO CONTENT
          ================================================================= */}

      {/* A <div>, not <main> - this only covers the hero, not the rest of
          the page's content (About, Members, Projects, ...), which all
          render as later siblings in AllRoutes.tsx's "/" route. The single
          <main id="main-content"> that covers all of it lives there instead
          - see that file's comment for why. */}
      <div className="flex-1 flex flex-col lg:flex-row relative z-10 items-center lg:items-start">
        {/* Left Section - Hero Text Content. pt-8 was nowhere near enough
            to clear the mobile-only decorative gradient band above (h-48 =
            192px, absolutely positioned behind this at inset-0) - this
            heading rendered starting right at the top of the hero, inside
            that band, its own "Innovate. Create. Lead." tagline included:
            two headings occupying the same space, and #29476E text is
            very low-contrast directly on the navy gradient showing
            through behind it. pt-52 clears the band with room to spare;
            lg:pt-20 is unchanged since the band itself is lg:hidden. */}
        <section
          className="flex flex-col justify-center w-full px-6 sm:px-8 pt-52 pb-8 lg:w-[40%] lg:pl-16 xl:pl-24 lg:pr-8 lg:pt-20"
          onMouseEnter={() => setTextPaused(true)}
          onMouseLeave={() => setTextPaused(false)}
        >
          {/* Rotating headline/subtext - fades out, swaps, fades back in.
              min-h reserves the tallest of the 4 slides' actual rendered
              height at each breakpoint (measured directly, not guessed -
              headline line-count doesn't track paragraph line-count, so
              the "obviously longest" slide isn't the tallest one at every
              width) so the CTA button below never jumps up and down as
              the active slide changes. aria-live="polite" announces the
              change to screen readers without interrupting them
              mid-sentence, and pausing on hover/focus (see the section's
              own handlers and the buttons' onFocus below) keeps this from
              being content that auto-updates with no way to stop it. */}
          <div
            aria-live="polite"
            className={`min-h-[14rem] sm:min-h-[12rem] md:min-h-[13rem] lg:min-h-[20rem] xl:min-h-[18.5rem] transition-opacity duration-300 ${
              textVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <h1 className="text-[#29476E] font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem] leading-tight mb-6 tracking-tight">
              {HERO_SLIDES[textSlide].headline}
            </h1>
            <p className="text-[#283D4B] text-lg sm:text-xl lg:text-[1.25rem] font-normal leading-relaxed max-w-md">
              {HERO_SLIDES[textSlide].text}
            </p>
          </div>

          {/* Call-to-Action + slide dots. No prev/next arrows - dots are
              the only manual control, direct-jump is enough for 4 slides
              this short-lived (3s each). */}
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <button
              className="rounded-full border-2 border-[#002B56] text-[#002B56] px-10 py-3 font-semibold text-lg lg:text-[1.2rem] hover:bg-[#002B56] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#002B56] focus:ring-offset-2"
              aria-label="Join NpcInnovationHub"
              onClick={() => setIsJoinModalOpen(true)}
            >
              Join Us
            </button>

            <div className="flex items-center gap-1.5">
              {HERO_SLIDES.map((slide, index) => (
                <button
                  key={slide.headline}
                  onClick={() => changeTextSlide(index)}
                  onFocus={() => setTextPaused(true)}
                  onBlur={() => setTextPaused(false)}
                  aria-label={`Show message ${index + 1} of ${HERO_SLIDES.length}`}
                  aria-current={index === textSlide}
                  className={`rounded-full transition-all duration-300 ${
                    index === textSlide
                      ? "bg-[#002B56] w-6 h-2"
                      : "bg-[#29476E]/25 hover:bg-[#29476E]/40 w-2 h-2"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Right Section - Hero Image Carousel + Slogan Container.
            items-end (was items-start) + right padding trimmed to a sliver
            (was lg:pr-8 xl:pr-12): the card and slogan both cap out at
            max-w-[580px], so on any screen wider than that cap this
            column has real slack left over - with items-start that slack
            rendered as a wide gap of unused navy between the card and the
            right edge. items-end pins both against the right edge
            instead; the small remaining pr just keeps the slogan text off
            the literal edge of the viewport. */}
        <div className="hidden lg:flex flex-col items-end justify-center w-full lg:w-[60%] lg:pl-12 xl:pl-20 lg:pr-4 xl:pr-6 lg:pt-20">
          {/* Hero Image Carousel. bg-gradient fill is the permanent card
              backdrop now - every member renders as a circular avatar
              (see below), not a full-bleed photo, so this navy surface is
              always visible around it rather than only showing through
              letterboxed gaps. No prev/next arrows - dots are the only
              manual control, same as the text carousel. */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl w-full max-w-[580px] h-[420px] xl:h-[470px] bg-gradient-to-br from-[#002B56] to-[#003366]">
            {/* Slides */}
            <div className="relative w-full h-full">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {/* One large circular avatar per member - object-cover
                      cropped to a fixed circle so every photo reads the
                      same way regardless of its own aspect ratio (a tall
                      portrait and a small square headshot both used to
                      render completely differently under object-contain).
                      pb-16 nudges the circle up so it sits clear of the
                      name/role overlay below it. */}
                  <div className="w-full h-full flex items-center justify-center pb-16">
                    <div className="w-40 h-40 sm:w-48 sm:h-48 xl:w-56 xl:h-56 rounded-full overflow-hidden ring-4 ring-white/30 shadow-xl bg-white/10">
                      <img
                        src={member.image}
                        alt={`${member.name} - ${member.role}`}
                        className="w-full h-full object-cover"
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  </div>
                  {/* Name/role, bottom-left - no gradient scrim needed
                      behind it any more, the card's own navy background
                      already gives white text plenty of contrast. */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 pb-20">
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
          </div>

          {/* Slogan - Positioned directly below image, always one line.
              This sits over the navy diagonal (same region the mobile
              gradient band's identical tagline is drawn against - see
              above), so it's white/90/80 here too now, not the old
              light-blue-on-black-on-navy mix - "Innovate." in plain black
              had barely any contrast against navy to begin with, and
              light-blue "Create."/"Lead." only worked here because it was
              functioning as a de-facto contrast color, not a real accent
              choice - matching mobile's already-correct treatment fixes
              both at once. */}
          <div className="mt-2 xl:mt-10 w-full max-w-[580px] text-right">
            <p className="text-[1.5rem] xl:text-[2rem] font-bold select-none leading-tight whitespace-nowrap">
              <span className="text-white">Innovate.</span>{" "}
              <span className="text-white/90">Create.</span>{" "}
              <span className="text-white/80">Lead.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
