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

import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../types/user.types";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "AboutHub", to: "/Hub-information" },
  { label: "Members", to: "/members" },
  { label: "Projects", to: "/projects" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Subtle shadow/blur once the page has scrolled, so the fixed bar reads as
  // "responding to scroll" rather than a flat static overlay.
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

  const dashboardPath =
    user?.role === UserRole.ADMIN ? "/Admindashboard" : "/dashboard";

  const isActive = (to: string) => location.pathname === to;

  const handleLogout = async () => {
    setShowUserMenu(false);
    setIsMenuOpen(false);
    await logout();
    navigate("/");
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto h-16 lg:h-20 flex items-center justify-between px-6 lg:px-12">
          {/* Logo */}
          <Link
            to="/"
            className="font-bold tracking-tight text-lg lg:text-xl whitespace-nowrap text-[#002B56] hover:text-[#003366] transition-colors duration-200"
          >
            NPC INNOVATION HUB
          </Link>

          {/* Desktop nav links */}
          <nav
            className="hidden lg:flex items-center gap-8 xl:gap-10"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                aria-current={isActive(link.to) ? "page" : undefined}
                className={`font-bold uppercase text-[1.05rem] pb-1 transition-colors duration-200 ${
                  isActive(link.to)
                    ? "text-[#00A0E3] border-b-2 border-[#00A0E3]"
                    : "text-[#002B56] hover:text-[#00A0E3]"
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
                  className="flex items-center gap-2 font-bold text-[#002B56] px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
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
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-[#002B56] text-white font-bold uppercase px-6 py-2.5 rounded-full shadow-sm hover:bg-[#003366] transition-colors duration-200"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden relative p-2 text-[#002B56] hover:bg-gray-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00A0E3]/20"
            onClick={() => setIsMenuOpen((o) => !o)}
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
                  aria-current={isActive(link.to) ? "page" : undefined}
                  className={`block px-4 py-3 font-bold uppercase rounded-lg transition-colors duration-200 ${
                    isActive(link.to)
                      ? "text-[#002B56] bg-[#ECF7FC] border-l-4 border-[#00A0E3]"
                      : "text-[#002B56] hover:bg-gray-50"
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
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block mt-2 text-center bg-[#002B56] text-white font-bold uppercase px-6 py-3 rounded-full shadow-sm hover:bg-[#003366] transition-colors duration-200"
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
          above exactly. */}
      <div aria-hidden="true" className="h-16 lg:h-20" />
    </>
  );
}
