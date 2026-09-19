// src/components/Navbar.tsx
//
// Single shared public navigation bar. Before this, the app had THREE
// separate, drifting copies of this navbar embedded in different places
// (components/Header.tsx, landing/HeroSection.tsx, projects/ProjectHero.tsx)
// plus several public routes (/members, /apply, /resources-room/*, ...)
// with no navbar at all. This is the one, consistent version, used on every
// public route via AllRoutes.tsx.
//
// Fixed to the top of the viewport on every screen size, with a spacer
// (rendered as part of this component) so page content never sits under it.

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../types/user.types";
import { useActiveSection } from "../hooks/useActiveSection";
import SkipToContent from "./SkipToContent";

// Primary nav points at the single-page Home story's sections, not straight
// at the deep pages - deepPath is still real and still reachable (each
// section has its own "View all" / "Learn more" link to it), just not what
// the top nav jumps to anymore. On any other route, a link is "active" when
// its deepPath matches the current page instead.
const NAV_LINKS = [
  { label: "Home", to: "/#home", sectionId: "home", deepPath: "/" },
  {
    label: "About Us",
    to: "/#about",
    sectionId: "about",
    deepPath: "/Hub-information",
  },
  {
    label: "Members",
    to: "/#members",
    sectionId: "members",
    deepPath: "/members",
  },
  {
    label: "Projects",
    to: "/#projects",
    sectionId: "projects",
    deepPath: "/projects",
  },
  {
    label: "Contact Us",
    to: "/#contact",
    sectionId: "contact",
    deepPath: "/contact-us",
  },
];
const SECTION_IDS = NAV_LINKS.map((link) => link.sectionId);

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Subtle shadow/blur once the page has scrolled, so the fixed bar reads as
  // "responding to scroll" rather than a flat static overlay. Independent of
  // pastHero below - purely cosmetic, applies to the solid state however it
  // was reached.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the account dropdown on outside click.
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close the mobile menu whenever the route changes (e.g. a Link was
  // clicked) rather than only on explicit close.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const onHome = location.pathname === "/";

  // Whether the hero's own bottom edge has scrolled up past the header -
  // i.e. whether what's actually behind the navbar right now is the hero's
  // photo/navy background (false) or the plain white section below it
  // (true). Defaults true so a route with no hero, or a moment before the
  // hero has mounted, never sits transparent over nothing.
  const [pastHero, setPastHero] = useState(true);

  // The homepage hero (see HeroSection.tsx) is a photo/navy background at
  // every breakpoint now, not a plain white one, so the navbar floats
  // transparent over it for as long as the hero is what's actually behind
  // it - same idea as glion.edu's navbar.
  //
  // IntersectionObserver, not a scrollY/hero-height comparison: the hero's
  // rendered height is responsive (min-h-screen plus its own content), so a
  // fixed pixel threshold would drift out of sync with it. rootMargin
  // shrinks the observed viewport by the header's own height from the top,
  // so "not intersecting" fires exactly when the hero's bottom edge reaches
  // the header - i.e. when the header stops being over the hero and starts
  // being over the white section below it. Polls for the #home element the
  // same bounded-rAF way the hash-scroll effect below does, since it's one
  // of AllRoutes.tsx's lazy chunks and may not be in the DOM yet on a fresh
  // load.
  //
  // useLayoutEffect, not useEffect: each route renders its own <Navbar/>
  // (see AllRoutes.tsx), so navigating here from another route mounts a
  // fresh instance whose pastHero starts at its default (true, solid)
  // until this runs. useEffect fires after the browser paints, so that
  // default briefly paints for real - a visible flash of solid white
  // before fading transparent on every client-side navigation back to
  // "/". useLayoutEffect runs synchronously before paint, so the corrected
  // value is what actually gets painted the first time.
  useLayoutEffect(() => {
    if (!onHome) {
      setPastHero(true);
      return undefined;
    }

    // Not implemented in jsdom (unlike matchMedia, which the effect below
    // relies on unguarded), and worth guarding for real degraded
    // environments too - falls back to the always-solid state rather than
    // an unhandled crash.
    if (typeof IntersectionObserver === "undefined") {
      setPastHero(true);
      return undefined;
    }

    // Header height differs below/at lg (67px vs 83px - must match the
    // spacer's h-[67px] lg:h-[83px] below and HeroSection.tsx's matching
    // -top-[67px] lg:-top-[83px] background offset). Re-read on every
    // (re)attach, and torn down/recreated below on a live breakpoint
    // crossing, rather than captured once - a resize that crosses lg
    // would otherwise leave the observer's rootMargin measuring against
    // the wrong height until the component next remounts.
    const isLg = () => window.matchMedia("(min-width: 1024px)").matches;

    let observer: IntersectionObserver | undefined;
    let rafId: number;
    let cancelled = false;
    const deadline = Date.now() + 3000;

    const setup = (hero: HTMLElement) => {
      const headerHeight = isLg() ? 83 : 67;
      // The observer is only a "something crossed the threshold, go
      // recheck" signal here - its own isIntersecting/rootBounds aren't
      // trusted directly. Right after a client-side route transition
      // inserts the hero into the DOM, the observer's very first callback
      // can fire once with geometry from before layout has fully settled
      // (a real, if intermittent, timing gap - observed as the navbar
      // staying solid on navigating back to "/" from another route).
      // Since the hero doesn't actually move again after that, there's no
      // later crossing to self-correct it. A fresh getBoundingClientRect()
      // read, on the other hand, always reflects current, fully-computed
      // layout, so recomputing from it - both once synchronously now and
      // again on every future callback - has no equivalent gap.
      const recompute = () => {
        setPastHero(hero.getBoundingClientRect().bottom <= headerHeight);
      };
      observer = new IntersectionObserver(recompute, {
        rootMargin: `-${headerHeight}px 0px 0px 0px`,
        threshold: 0,
      });
      observer.observe(hero);
      recompute();
    };

    const attach = () => {
      if (cancelled) return;
      const hero = document.getElementById("home");
      if (hero) {
        setup(hero);
        return;
      }
      if (Date.now() < deadline) rafId = requestAnimationFrame(attach);
    };

    attach();

    const mql = window.matchMedia("(min-width: 1024px)");
    const handleBreakpointChange = () => {
      const hero = document.getElementById("home");
      if (!hero) return;
      observer?.disconnect();
      setup(hero);
    };
    mql.addEventListener("change", handleBreakpointChange);

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      observer?.disconnect();
      mql.removeEventListener("change", handleBreakpointChange);
    };
  }, [onHome]);

  const transparentAtTop = onHome && !pastHero;

  // Which Home section is currently in view, so the right nav link
  // highlights while scrolling - only runs on "/" itself.
  const activeSectionId = useActiveSection(SECTION_IDS, onHome);

  // A Link to "/#section" while already on "/" only changes the hash
  // (React Router doesn't remount the route), so this effect is what
  // actually does the scrolling - covers both that case and arriving at
  // "/#section" fresh from another page (or a hard reload/typed URL).
  // Respects reduced-motion.
  //
  // The target section is one of AllRoutes.tsx's lazy-loaded chunks, so on
  // a fresh load it may not be in the DOM yet the instant this runs - polls
  // for it via requestAnimationFrame (bounded to ~3s) rather than a single
  // check that would silently no-op while the chunk is still downloading.
  useEffect(() => {
    if (!onHome || !location.hash) return undefined;
    const id = location.hash.slice(1);

    let rafId: number;
    let cancelled = false;
    const deadline = Date.now() + 3000;

    const tryScroll = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (el) {
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        el.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
        return;
      }
      if (Date.now() < deadline) {
        rafId = requestAnimationFrame(tryScroll);
      }
    };

    tryScroll();
    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [onHome, location.hash]);

  const dashboardPath =
    user?.role === UserRole.ADMIN ? "/Admindashboard" : "/dashboard";

  const isActive = (link: (typeof NAV_LINKS)[number]) =>
    onHome
      ? activeSectionId === link.sectionId
      : location.pathname === link.deepPath;

  const handleLogout = async () => {
    setShowUserMenu(false);
    setIsMenuOpen(false);
    await logout();
    navigate("/");
  };

  return (
    <>
      <SkipToContent />
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          transparentAtTop
            ? "bg-transparent shadow-none"
            : `bg-white ${scrolled ? "shadow-md" : "shadow-sm"}`
        }`}
      >
        {/* Thin two-tone navy gradient accent, same treatment as the Hero
            section's mobile header accent line - ties this flat white bar
            back to the homepage's signature brand gradient instead of
            reading as a plain, disconnected white strip. Faded out (not
            unmounted) while transparentAtTop, so the header's height never
            changes and the spacer div below stays accurate. */}
        <div
          className={`h-[3px] w-full bg-gradient-to-r from-[#002B56] via-[#003366] to-[#002B56] transition-opacity duration-300 ${
            transparentAtTop ? "opacity-0" : ""
          }`}
        />

        <div className="max-w-7xl mx-auto h-16 lg:h-20 flex items-center justify-between px-6 lg:px-12">
          {/* Logo */}
          <Link
            to="/"
            className={`font-bold tracking-tight text-lg lg:text-xl whitespace-nowrap transition-colors duration-200 ${
              transparentAtTop
                ? "text-white hover:text-white/80 drop-shadow-md"
                : "text-[#002B56] hover:text-[#003366]"
            }`}
          >
            NPC INNOVATION HUB
          </Link>

          {/* Desktop nav links. gap tightened (was gap-8 xl:gap-10) - the
              links were reading as too spread out from each other,
              especially on wider screens. */}
          <nav
            className="hidden lg:flex items-center gap-4 xl:gap-6"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                aria-current={isActive(link) ? "page" : undefined}
                // An outlined pill for the active page - same border-2 +
                // rounded-full box on every link (only the border color
                // differs, transparent vs navy) so every item keeps
                // identical size/alignment whether or not it's active.
                className={`font-bold uppercase text-[1.05rem] px-4 py-1.5 rounded-full border-2 transition-all duration-200 ${
                  transparentAtTop
                    ? isActive(link)
                      ? "border-white text-white hover:bg-white hover:text-[#002B56] drop-shadow-sm"
                      : "border-transparent text-white/90 hover:text-white drop-shadow-sm"
                    : isActive(link)
                      ? "border-[#002B56] text-[#002B56] hover:bg-[#002B56] hover:text-white"
                      : "border-transparent text-[#002B56] hover:text-[#003366]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right side: Sign In, or an account menu once logged in */}
          <div className="hidden lg:block">
            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu((s) => !s)}
                  aria-expanded={showUserMenu}
                  aria-haspopup="true"
                  className={`flex items-center gap-2 font-bold text-white px-5 py-2.5 rounded-full shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    transparentAtTop
                      ? "bg-white/10 backdrop-blur-sm border-2 border-white hover:bg-white hover:text-[#002B56] focus:ring-white"
                      : "bg-[#002B56] hover:bg-[#003366] hover:shadow-md focus:ring-[#002B56]"
                  }`}
                >
                  {user.firstName || "Account"}
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
                    <Link
                      to={dashboardPath}
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-3 text-sm font-bold text-[#002B56] hover:bg-gray-50 transition-colors duration-200"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => void handleLogout()}
                      className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 border-t border-gray-100 transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className={`text-white font-bold uppercase px-6 py-2.5 rounded-full shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  transparentAtTop
                    ? "bg-white/10 backdrop-blur-sm border-2 border-white hover:bg-white hover:text-[#002B56] focus:ring-white"
                    : "bg-[#002B56] hover:bg-[#003366] hover:shadow-md focus:ring-[#002B56]"
                }`}
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger. White when transparentAtTop to match the
              logo, except once the menu is open - the panel below is
              always solid white (readable list items need a guaranteed
              background regardless of what's behind the header), so the
              icon switches to its solid-state color the moment it opens
              rather than staying white against a white panel. */}
          <button
            className={`lg:hidden relative p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 ${
              transparentAtTop && !isMenuOpen
                ? "text-white hover:bg-white/10 focus:ring-white/40"
                : "text-[#002B56] hover:bg-gray-50 focus:ring-[#002B56]/20"
            }`}
            onClick={() => setIsMenuOpen((o) => !o)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            <div className="w-6 h-6 relative">
              <span
                className={`absolute block w-6 h-0.5 transform transition-all duration-300 ${
                  transparentAtTop && !isMenuOpen ? "bg-white" : "bg-[#002B56]"
                } ${isMenuOpen ? "rotate-45 top-2.5" : "top-0"}`}
              />
              <span
                className={`absolute block w-6 h-0.5 top-2.5 transition-all duration-300 ${
                  transparentAtTop && !isMenuOpen ? "bg-white" : "bg-[#002B56]"
                } ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`absolute block w-6 h-0.5 transform transition-all duration-300 ${
                  transparentAtTop && !isMenuOpen ? "bg-white" : "bg-[#002B56]"
                } ${isMenuOpen ? "-rotate-45 top-2.5" : "top-5"}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <nav
            className="lg:hidden px-6 pb-4 bg-white border-t border-gray-100 max-h-[calc(100vh-4rem)] overflow-y-auto"
            aria-label="Mobile navigation"
          >
            <div className="space-y-1 pt-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  // A hash-only navigation (e.g. "/#members" while already
                  // on "/") doesn't change location.pathname, so the
                  // route-change effect above never fires to close this
                  // menu - close it directly on tap instead.
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActive(link) ? "page" : undefined}
                  // Same outlined-pill idea as the desktop nav: an
                  // identical border-2 box on every row, only the active
                  // one's border color is visible.
                  className={`block px-4 py-3 font-bold uppercase rounded-lg border-2 transition-colors duration-200 ${
                    isActive(link)
                      ? "text-[#002B56] border-[#002B56] bg-white"
                      : "text-[#002B56] border-transparent hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {isAuthenticated && user ? (
                <>
                  <Link
                    to={dashboardPath}
                    className="block px-4 py-3 font-bold text-[#002B56] rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => void handleLogout()}
                    className="w-full text-left mt-2 px-4 py-3 font-bold text-center bg-white text-red-600 rounded-full shadow-sm border border-gray-200 hover:bg-red-50 transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block mt-2 text-center bg-[#002B56] text-white font-bold uppercase px-6 py-3 rounded-full shadow-sm hover:bg-[#003366] hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#002B56] focus:ring-offset-2"
                >
                  Sign In
                </Link>
              )}
            </div>
          </nav>
        )}
      </header>

      {/* Reserves the space the fixed header occupies so page content isn't
          hidden underneath it. Height must match the header's own h-16/h-20
          content row plus the 3px gradient accent bar above it, exactly. */}
      <div aria-hidden="true" className="h-[67px] lg:h-[83px]" />
    </>
  );
}
