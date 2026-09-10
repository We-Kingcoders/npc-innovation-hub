// src/components/member/Sidebar.tsx

import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
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
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useMember } from "../../hooks/useMember";
import { getUserInitials, getUserFullName } from "../../types/user.types";

interface SidebarItem {
  name: string;
  icon: React.ReactNode;
  link: string;
  badge?: number;
}

const sidebarItems: SidebarItem[] = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    link: "/dashboard",
  },
  {
    name: "Notifications",
    icon: <Bell size={20} />,
    link: "/notifications",
    badge: 6,
  },
  {
    name: "Resources",
    icon: <FolderOpen size={20} />,
    link: "/dashboard/resources",
    badge: 5,
  },
  {
    name: "Projects",
    icon: <Briefcase size={20} />,
    link: "/dashboard/projects",
    badge: 30,
  },
  {
    name: "Messages",
    icon: <MessageSquare size={20} />,
    link: "/hub-channel",
  },
  {
    name: "Events",
    icon: <Calendar size={20} />,
    link: "/dashboard/events",
    badge: 6,
  },
  {
    name: "Blog",
    icon: <BookOpen size={20} />,
    link: "/blog",
  },
  {
    name: "My Tasks",
    icon: <ClipboardList size={20} />,
    link: "/dashboard/tasks",
  },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { member, fetchMember } = useMember();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Fetch member profile once to get the uploaded avatar
  useEffect(() => {
    if (user?.id) fetchMember(user.id);
  }, [user?.id, fetchMember]);

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

  const displayName = user ? getUserFullName(user) : "User";
  const initials = user ? getUserInitials(user) : "U";
  const fallbackName = user?.email?.split("@")[0] ?? "User";

  // Prefer the uploaded member image, fall back to auth image, then show initials
  const avatarUrl = member?.imageUrl || user?.image || null;

  // Prefer member display name if set (e.g. "Entue MUGABO" from profile form)
  const shownName = member?.name || displayName || fallbackName;

  return (
    <>
      <aside className="w-64 ml-6 rounded-xl bg-navy-800 h-screen lg:sticky lg:top-0 flex flex-col py-6 px-6 text-white shadow-lg">
        {/* Brand - sized (not truncated) to stay fully visible on one line
            within the sidebar's own width, no horizontal scroll needed. */}
        <div className="pb-4 flex-shrink-0">
          <span className="block text-sm font-extrabold tracking-tight text-white whitespace-nowrap">
            NPC INNOVATION HUB
          </span>
        </div>

        {/* Scrolls internally so a tall menu never pushes Logout off-screen
            or forces the whole sidebar (rather than the page) to scroll. */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {/* Profile Section */}
          <div className="flex flex-col items-center mb-10 px-1">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={shownName}
                className="w-20 h-20 rounded-full object-cover mb-2 border-2 border-navy-400"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-navy-600 border-2 border-navy-400 mb-2 flex items-center justify-center text-2xl font-bold select-none">
                {initials}
              </div>
            )}

            <span className="text-xl font-bold uppercase text-center leading-tight truncate max-w-full">
              {shownName}
            </span>

            {(member?.role || user?.role) && (
              <span className="text-xs uppercase text-navy-200 mt-1 truncate max-w-full">
                {member?.role || user?.role}
              </span>
            )}
          </div>

          {/* Menu label */}
          <div className="mb-6 ml-2 text-sm text-navy-300 uppercase tracking-wide font-bold">
            Menu
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {sidebarItems.map((item) => (
              <NavLink
                to={item.link}
                key={item.name}
                end={item.link === "/dashboard"}
                className={({ isActive }) =>
                  `group flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 min-w-0 ${
                    isActive
                      ? "bg-navy-700 shadow-md border-l-4 border-white"
                      : "text-navy-100 hover:bg-navy-700 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex-shrink-0 rounded-lg p-2 relative transition-colors duration-200 ${
                        isActive
                          ? "bg-white text-navy-800"
                          : "bg-navy-700 text-navy-100 group-hover:bg-navy-600 group-hover:text-white"
                      }`}
                    >
                      {item.icon}
                      {item.badge !== undefined && (
                        <span className="absolute -top-2 -right-2 text-xs bg-white text-navy-800 ring-2 ring-navy-800 rounded-full w-5 h-5 flex items-center justify-center font-bold">
                          {item.badge > 99 ? "99+" : item.badge}
                        </span>
                      )}
                    </span>
                    <span className="flex-1 min-w-0 truncate font-bold uppercase">
                      {item.name}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout Button - pinned below the scrollable region, always visible */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          disabled={isLoggingOut}
          className="flex-shrink-0 flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 border border-navy-600 hover:bg-white hover:border-white hover:shadow-md font-bold uppercase text-navy-100 hover:text-navy-800 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut size={20} />
          <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
        </button>
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
