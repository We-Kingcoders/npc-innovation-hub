// src/components/member/Sidebar.tsx

import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Bell,
  FolderOpen,
  Briefcase,
  MessageSquare,
  Calendar,
  LogOut,
  BookOpen,
  ClipboardList,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

interface SidebarItem {
  name: string;
  icon: React.ReactNode;
  link: string;
  badge?: number;
}

const sidebarItems: SidebarItem[] = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={18} strokeWidth={2.5} />,
    link: "/dashboard",
  },
  {
    name: "Notifications",
    icon: <Bell size={18} strokeWidth={2.5} />,
    link: "/notifications",
    badge: 6,
  },
  {
    name: "Resources",
    icon: <FolderOpen size={18} strokeWidth={2.5} />,
    link: "/dashboard/resources",
    badge: 5,
  },
  {
    name: "Projects",
    icon: <Briefcase size={18} strokeWidth={2.5} />,
    link: "/dashboard/projects",
    badge: 30,
  },
  {
    name: "Messages",
    icon: <MessageSquare size={18} strokeWidth={2.5} />,
    link: "/hub-channel",
  },
  {
    name: "Events",
    icon: <Calendar size={18} strokeWidth={2.5} />,
    link: "/dashboard/events",
    badge: 6,
  },
  {
    name: "Blog",
    icon: <BookOpen size={18} strokeWidth={2.5} />,
    link: "/blog",
  },
  {
    name: "My Tasks",
    icon: <ClipboardList size={18} strokeWidth={2.5} />,
    link: "/dashboard/tasks",
  },
];

export const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  // Was a bare w-64 ml-6 (280px) rendered inline unconditionally - on a
  // 320-375px phone that alone left almost no room for the actual page
  // content next to it in DashboardLayout's flex row (the admin sidebar
  // already had this off-canvas treatment; this one never did). Closed
  // by default so a phone doesn't load into the drawer covering the
  // page - matches the admin sidebar's own default, fixed for the same
  // reason there.
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // Desktop icon-only collapse, matching admin-components/Sidebar.tsx -
  // self-contained here since this <aside> is a plain flex sibling of the
  // content column in DashboardLayout, so narrowing it on `lg:` classes
  // alone reflows the page without any layout-level wiring.
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const location = useLocation();

  // Close the mobile drawer on navigation, same as the public Navbar -
  // otherwise a tapped link left the new page rendered behind the still-
  // open drawer and its backdrop, needing a second tap just to see it.
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
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
        // is measured against the largest possible viewport, so with the
        // browser's address bar visible it runs past the actually-visible
        // area and can put the logout button behind the browser chrome.
        // 100dvh tracks the real visible viewport instead.
        className={`fixed inset-y-0 left-0 z-30 w-64 ${isDesktopCollapsed ? "lg:w-20" : "lg:w-64"} lg:sticky lg:top-0 lg:left-auto lg:ml-6 lg:translate-x-0 rounded-none lg:rounded-xl bg-navy-800 h-dvh flex flex-col text-white shadow-lg transition-transform lg:transition-all duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile-only toggle, positioned outside the sidebar's own right
            edge (same trick as the admin sidebar's) so the transform that
            slides this whole <aside> off-screen carries the button along
            with it - it lands as a small tab right at the screen's left
            edge when closed, instead of a separately `fixed` button that
            would sit on top of Topbar's search bar. */}
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

        {/* Brand + desktop collapse toggle share one row, matching
            admin-components/Sidebar.tsx exactly. Own profile access lives
            in Topbar.tsx's profile dropdown, not duplicated here - this
            used to also carry a large avatar/name/role block, removed for
            the same reason (and because it duplicated dashboard/ProfileCard.tsx
            shown right below it on the Dashboard page). */}
        <div
          className={`flex items-center flex-shrink-0 border-b border-navy-700 pt-5 pb-3 justify-between px-6 ${
            isDesktopCollapsed ? "lg:justify-center lg:px-3" : ""
          }`}
        >
          <span
            className={`text-sm font-extrabold tracking-tight text-white whitespace-nowrap truncate ${isDesktopCollapsed ? "lg:hidden" : ""}`}
          >
            NPC INNOVATION HUB
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
            Logout off-screen or forces the whole sidebar (rather than the
            page) to scroll. */}
        <nav className="flex-1 px-4 py-3 overflow-y-auto hide-scrollbar">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.link}
                  end={item.link === "/dashboard"}
                  title={isDesktopCollapsed ? item.name : undefined}
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
                        {item.badge !== undefined && (
                          <span
                            className={`absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-white text-navy-800 ring-2 ring-navy-800 text-[10px] font-bold rounded-full flex items-center justify-center px-1 ${isDesktopCollapsed ? "lg:scale-90" : ""}`}
                          >
                            {item.badge > 99 ? "99+" : item.badge}
                          </span>
                        )}
                      </div>
                      <span
                        className={`flex-1 min-w-0 truncate text-sm uppercase ${isActive ? "text-white" : "text-navy-100"} group-hover:text-white transition-colors duration-200 ${isDesktopCollapsed ? "lg:hidden" : ""}`}
                      >
                        {item.name}
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button - pinned below the scrollable region, always visible */}
        <div
          className={`px-4 pb-4 mt-auto flex-shrink-0 ${isDesktopCollapsed ? "lg:px-3" : ""}`}
        >
          <button
            onClick={() => setShowLogoutConfirm(true)}
            disabled={isLoggingOut}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border border-navy-600 hover:bg-white hover:border-white hover:font-bold uppercase text-sm text-navy-100 hover:text-navy-800 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed ${isDesktopCollapsed ? "lg:justify-center lg:px-3" : ""}`}
          >
            <LogOut
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
            <span className={isDesktopCollapsed ? "lg:hidden" : ""}>
              {isLoggingOut ? "Signing out..." : "Sign Out"}
            </span>
          </button>
        </div>
      </aside>

      {/* Sign Out Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-navy-900 bg-opacity-60">
          <div className="bg-white rounded-xl shadow-xl border border-mist-300 max-w-md w-full mx-4 p-6">
            <h2 className="text-2xl font-bold text-navy-800 mb-4">
              Confirm Sign Out
            </h2>
            <p className="text-mist-600 mb-6">
              Are you sure you want to sign out? You'll need to sign in again to
              access your dashboard.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                disabled={isLoggingOut}
                className="px-6 py-2 bg-mist-200 text-navy-800 border border-mist-300 rounded-lg hover:bg-mist-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-6 py-2 bg-navy-800 text-white rounded-lg hover:bg-navy-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing out...
                  </span>
                ) : (
                  "Yes, Sign Out"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
