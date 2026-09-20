// src/components/ui/Sidebar.tsx
//
// Shared sidebar shell used by both the Admin and Member surfaces so the
// two never drift apart visually or behaviorally again - each caller only
// supplies its own brand text and its own `links` (nav items, icons,
// badge counts, whatever business logic decides those are), and this
// component owns all the shell mechanics: mobile off-canvas drawer,
// desktop icon-only collapse, active-link styling, and sign-out.
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronsLeft, ChevronsRight, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export interface SidebarLinkItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  // Exact-match instead of prefix-match for this link's active state.
  // Needed whenever this link's own path is itself a prefix of another
  // link's path (e.g. Member's "/dashboard" vs "/dashboard/projects") -
  // without it, the parent link would render "active" on every child
  // route too.
  end?: boolean;
}

interface SidebarProps {
  brand?: string;
  links: SidebarLinkItem[];
}

export default function Sidebar({
  brand = "NPC INNOVATION HUB",
  links,
}: SidebarProps) {
  const location = useLocation();
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuth();

  // Close the mobile drawer on navigation - otherwise a tapped link left
  // the new page rendered behind the still-open drawer and its backdrop.
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        // h-dvh, not h-screen: on mobile this is `fixed inset-y-0` with an
        // explicit height, which wins over the inset-derived one - 100vh
        // runs past the actually-visible area when the browser's address
        // bar is showing and can put the bottom items behind it. 100dvh
        // tracks the real visible viewport instead.
        className={`fixed inset-y-0 left-0 z-30 w-64 ${isDesktopCollapsed ? "lg:w-20" : "lg:w-64"} lg:sticky lg:top-0 lg:left-auto lg:ml-6 lg:translate-x-0 rounded-none lg:rounded-xl bg-navy-800 h-dvh flex flex-col text-white shadow-lg transition-transform lg:transition-all duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile-only off-canvas toggle - stays outside the brand row
            since the whole sidebar translates off-screen on mobile; it
            needs to remain reachable independent of that. */}
        <button
          onClick={() => setIsMobileOpen((open) => !open)}
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          className="lg:hidden absolute -right-11 top-6 bg-navy-800 text-white p-2 rounded-r-lg shadow-lg"
        >
          {isMobileOpen ? (
            <ChevronsLeft size={20} />
          ) : (
            <ChevronsRight size={20} />
          )}
        </button>

        {/* Brand + desktop collapse toggle share one row. Profile access
            lives in each surface's own Topbar profile dropdown, not
            duplicated here. */}
        <div
          className={`flex items-center flex-shrink-0 border-b border-navy-700 pt-5 pb-3 justify-between px-6 ${
            isDesktopCollapsed ? "lg:justify-center lg:px-3" : ""
          }`}
        >
          <span
            className={`text-sm font-extrabold tracking-tight text-white whitespace-nowrap truncate ${isDesktopCollapsed ? "lg:hidden" : ""}`}
          >
            {brand}
          </span>
          <button
            onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
            aria-label={
              isDesktopCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
            className="hidden lg:flex items-center justify-center flex-shrink-0 bg-white text-navy-800 p-1.5 rounded-full shadow-md hover:shadow-lg transition-shadow"
          >
            {isDesktopCollapsed ? (
              <ChevronsRight size={16} />
            ) : (
              <ChevronsLeft size={16} />
            )}
          </button>
        </div>

        {/* Navigation - scrolls internally so a tall menu never pushes
            Sign Out off-screen or forces the whole sidebar (rather than
            the page) to scroll. */}
        <nav className="flex-1 px-4 py-3 overflow-y-auto hide-scrollbar">
          <ul className="space-y-1">
            {links.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  title={isDesktopCollapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 min-w-0 ${
                      isDesktopCollapsed ? "lg:justify-center" : ""
                    } ${
                      isActive
                        ? "bg-navy-700 shadow-md border-l-4 border-white font-bold"
                        : "text-navy-100 hover:bg-navy-700 hover:text-white hover:font-bold"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="relative flex-shrink-0">
                        <div
                          className={`p-1.5 rounded-lg transition-colors duration-200 ${
                            isActive
                              ? "bg-white text-navy-800"
                              : "bg-navy-700 text-navy-100 group-hover:bg-navy-600 group-hover:text-white"
                          }`}
                        >
                          {item.icon}
                        </div>
                        {!!item.badge && item.badge > 0 && (
                          <span
                            className={`absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-white text-navy-800 ring-2 ring-navy-800 text-[10px] font-bold rounded-full flex items-center justify-center ${isDesktopCollapsed ? "lg:scale-90" : ""}`}
                          >
                            {item.badge > 99 ? "99+" : item.badge}
                          </span>
                        )}
                      </div>
                      <span
                        className={`flex-1 min-w-0 truncate text-sm uppercase ${isActive ? "text-white" : "text-navy-100"} group-hover:text-white transition-colors duration-200 ${isDesktopCollapsed ? "lg:hidden" : ""}`}
                      >
                        {item.label}
                      </span>
                      {!!item.badge && item.badge > 0 && (
                        <span
                          className={`ml-auto flex-shrink-0 bg-white text-navy-800 text-xs font-bold px-2 py-0.5 rounded-full ${isDesktopCollapsed ? "lg:hidden" : ""}`}
                        >
                          {item.badge > 99 ? "99+" : item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sign Out - pinned below the scrollable region, always visible */}
        <div
          className={`px-4 pb-4 mt-auto flex-shrink-0 ${isDesktopCollapsed ? "lg:px-3" : ""}`}
        >
          <button
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border border-navy-600 hover:bg-white hover:border-white hover:font-bold uppercase text-sm text-navy-100 hover:text-navy-800 transition-all duration-200 group ${isDesktopCollapsed ? "lg:justify-center lg:px-3" : ""} ${isLoggingOut ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => void handleLogout()}
            disabled={isLoggingOut}
          >
            <LogOut
              size={20}
              className={`group-hover:scale-110 transition-transform ${isLoggingOut ? "animate-spin" : ""}`}
            />
            <span className={isDesktopCollapsed ? "lg:hidden" : ""}>
              {isLoggingOut ? "Signing out..." : "Sign Out"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
