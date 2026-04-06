/**
 * Member Sidebar Component
 * Place in: src/components/member/Sidebar.tsx
 */

import React, { useState } from "react";
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
import { getUserInitials, getUserFullName } from "../../types/user.types";

interface SidebarItem {
  name: string;
  icon: React.ReactNode;
  link: string;
  badge?: number;
  color: string;
}

const sidebarItems: SidebarItem[] = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    link: "/dashboard",
    color: "bg-[#9B5CFF]",
  },
  {
    name: "Notifications",
    icon: <Bell size={20} />,
    link: "/notifications",
    badge: 6,
    color: "bg-[#FF4D4D]",
  },
  {
    name: "Resources",
    icon: <FolderOpen size={20} />,
    link: "/dashboard/resources",
    badge: 5,
    color: "bg-[#38D9A9]",
  },
  {
    name: "Projects",
    icon: <Briefcase size={20} />,
    link: "/dashboard/projects",
    badge: 30,
    color: "bg-[#A5B4FC]",
  },
  {
    name: "Messages",
    icon: <MessageSquare size={20} />,
    link: "/hub-channel",
    color: "bg-[#38D9A9]",
  },
  {
    name: "Events",
    icon: <Calendar size={20} />,
    link: "/dashboard/events",
    badge: 6,
    color: "bg-[#38D9A9]",
  },
  {
    name: "Blog",
    icon: <BookOpen size={20} />,
    link: "/blog",
    color: "bg-[#F97316]",
  },
  {
    name: "My Tasks",
    icon: <ClipboardList size={20} />,
    link: "/dashboard/tasks",
    color: "bg-[#3B82F6]",
  },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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

  // Derive display values from the real User shape (firstName + lastName)
  const displayName = user ? getUserFullName(user) : "User";
  const initials = user ? getUserInitials(user) : "U";
  const fallbackName = user?.email?.split("@")[0] ?? "User";

  return (
    <>
      <aside className="w-64 ml-6 rounded-md bg-[#0C2340] min-h-screen flex flex-col justify-between py-8 px-6 text-white shadow-xl">
        <div>
          {/* Profile Section */}
          <div className="flex flex-col items-center mb-10">
            {user?.image ? (
              <img
                src={user.image}
                alt={displayName}
                className="w-20 h-20 rounded-full object-cover mb-2 border-2 border-[#9B5CFF]"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#9B5CFF] mb-2 flex items-center justify-center text-2xl font-bold">
                {initials}
              </div>
            )}

            <span className="text-xl font-semibold text-center">
              {displayName || fallbackName}
            </span>

            {user?.role && (
              <span className="text-xs text-gray-400 mt-1">{user.role}</span>
            )}
          </div>

          {/* Menu Section */}
          <div className="mb-6 ml-2 text-sm opacity-70 uppercase tracking-wide font-medium">
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
                  `flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-[#122e4a] font-medium shadow-md border-l-4 border-[#9B5CFF]"
                      : "hover:bg-[#122e4a] hover:shadow-sm"
                  }`
                }
              >
                <span
                  className={`${item.color} text-white rounded-lg p-2 relative`}
                >
                  {item.icon}
                  {item.badge !== undefined && (
                    <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </span>
                <span className="flex-1">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          disabled={isLoggingOut}
          className="flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 hover:bg-red-600 hover:shadow-md font-medium text-red-400 hover:text-white mt-10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut size={20} />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Confirm Logout
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out? You'll need to log in again to
              access your dashboard.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                disabled={isLoggingOut}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    Logging out...
                  </span>
                ) : (
                  "Yes, Logout"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
