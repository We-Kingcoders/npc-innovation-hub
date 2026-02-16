import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Mail,
  FolderOpen,
  Briefcase,
  FileText,
  Users,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Calendar,
} from "lucide-react";
import { sidebarLinks } from "../../data/admin-data/sidebarLinks";
import { useAuth } from "../../hooks/useAuth";
import { getUserFullName, getUserInitials } from "../../types/user.types";

const iconComponents = {
  dashboard: LayoutDashboard,
  notification: Mail,
  resources: FolderOpen,
  projects: Briefcase,
  blog: FileText,
  members: Users,
  calendar: Calendar,
};

const iconColors = {
  dashboard: "from-blue-500 to-indigo-600",
  notification: "from-red-500 to-rose-600",
  resources: "from-emerald-500 to-green-600",
  projects: "from-sky-500 to-blue-600",
  blog: "from-teal-500 to-cyan-600",
  members: "from-purple-500 to-violet-600",
  calendar: "from-orange-500 to-amber-600",
};

export default function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Get user data and logout function from AuthContext
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

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

  // Use helper functions from user.types.ts or fallback to defaults
  const displayName = user ? getUserFullName(user) : "Admin User";
  const displayRole = user?.role || "Administrator";
  const displayAvatar = user?.image || null;
  const displayInitials = user ? getUserInitials(user) : "AU";

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          ${isCollapsed ? "-translate-x-full lg:w-20" : "translate-x-0 w-64"}
          lg:translate-x-0
          bg-gradient-to-br from-[#07295B] via-[#0a3a7a] to-[#07295B]
          min-h-screen flex flex-col
          transition-all duration-300 ease-in-out
          shadow-2xl
        `}
      >
        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="lg:hidden absolute -right-12 top-6 bg-[#07295B] text-white p-2 rounded-r-lg shadow-lg"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:block absolute -right-3 top-8 bg-white text-[#07295B] p-1.5 rounded-full shadow-lg hover:shadow-xl transition-shadow z-10"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? <Menu size={16} /> : <X size={16} />}
        </button>

        {/* User Profile Section */}
        <div className="px-6 py-8 border-b border-white/10">
          <div className="relative">
            <button
              onClick={() => !isCollapsed && setShowUserMenu(!showUserMenu)}
              className={`
                flex items-center gap-3 w-full
                ${!isCollapsed && "hover:bg-white/5"} 
                rounded-xl p-2 transition-all duration-200
                ${isCollapsed && "justify-center"}
              `}
            >
              {/* Avatar */}
              <div className="relative">
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt={displayName}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm ring-2 ring-white/20 shadow-lg">
                    {displayInitials}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#07295B]" />
              </div>

              {/* User Info */}
              {!isCollapsed && (
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold text-sm leading-tight">
                        {displayName}
                      </p>
                      <p className="text-blue-200 text-xs mt-0.5">
                        {displayRole}
                      </p>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-white/60 transition-transform ${
                        showUserMenu ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
              )}
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && !isCollapsed && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl overflow-hidden z-50">
                <a
                  href="/admin/profile"
                  className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  View Profile
                </a>
                <a
                  href="/admin/profile/settings"
                  className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
                >
                  Profile Settings
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6">
          {!isCollapsed && (
            <span className="px-4 text-xs font-semibold text-blue-200 uppercase tracking-wider mb-3 block">
              Menu
            </span>
          )}
          <ul className="space-y-1.5">
            {sidebarLinks.map(({ icon, label, notification, path }) => {
              const IconComponent =
                iconComponents[icon as keyof typeof iconComponents];
              const active = isActive(path);

              return (
                <li key={label}>
                  <Link
                    to={path}
                    className={`
                      group flex items-center gap-3 px-3 py-2.5 rounded-xl
                      transition-all duration-200 relative
                      ${isCollapsed ? "justify-center" : ""}
                      ${
                        active
                          ? "bg-white/15 shadow-lg backdrop-blur-sm"
                          : "hover:bg-white/5"
                      }
                    `}
                    title={isCollapsed ? label : undefined}
                  >
                    {/* Active Indicator */}
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                    )}

                    {/* Icon Container */}
                    <div className="relative flex-shrink-0">
                      <div
                        className={`
                          p-2 rounded-lg 
                          bg-gradient-to-br ${iconColors[icon as keyof typeof iconColors]}
                          ${active ? "shadow-lg" : "shadow-md group-hover:shadow-lg"}
                          transition-all duration-200
                          ${active ? "scale-110" : "group-hover:scale-105"}
                        `}
                      >
                        <IconComponent
                          size={18}
                          className="text-white"
                          strokeWidth={2.5}
                        />
                      </div>

                      {/* Notification Badge */}
                      {notification > 0 && (
                        <span
                          className={`
                            absolute -top-1 -right-1 
                            min-w-[18px] h-[18px] 
                            bg-red-500 text-white 
                            text-[10px] font-bold 
                            rounded-full 
                            flex items-center justify-center
                            shadow-lg
                            animate-pulse
                            ${isCollapsed ? "scale-90" : ""}
                          `}
                        >
                          {notification > 99 ? "99+" : notification}
                        </span>
                      )}
                    </div>

                    {/* Label */}
                    {!isCollapsed && (
                      <span
                        className={`
                          flex-1 font-medium text-sm
                          ${active ? "text-white" : "text-blue-100"}
                          group-hover:text-white
                          transition-colors duration-200
                        `}
                      >
                        {label}
                      </span>
                    )}

                    {/* Notification Badge (Desktop) */}
                    {!isCollapsed && notification > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-lg">
                        {notification > 99 ? "99+" : notification}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="px-4 pb-6 mt-auto">
          <button
            className={`
              w-full flex items-center gap-3 
              px-4 py-3 rounded-xl
              bg-red-500/10 hover:bg-red-500/20
              border border-red-400/20 hover:border-red-400/40
              text-red-300 hover:text-red-200
              font-semibold text-sm
              transition-all duration-200
              group
              ${isCollapsed ? "justify-center px-3" : ""}
              ${isLoggingOut ? "opacity-50 cursor-not-allowed" : ""}
            `}
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut
              size={20}
              className={`group-hover:scale-110 transition-transform ${
                isLoggingOut ? "animate-spin" : ""
              }`}
            />
            {!isCollapsed && (
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Toggle Button (when collapsed) */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="lg:hidden fixed bottom-6 left-6 z-50 bg-[#07295B] text-white p-4 rounded-full shadow-2xl"
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>
      )}
    </>
  );
}
