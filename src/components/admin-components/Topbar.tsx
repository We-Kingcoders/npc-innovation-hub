import { Search, Sun, Moon, User, Settings } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getUserFullName } from "../../types/user.types";
import NotificationBell from "../notifications/NotificationBell";

export default function Topbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Get user data and logout function from AuthContext
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setShowProfile(false); // Close dropdown
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Use helper function from user.types.ts or fallback to defaults
  const displayName = user ? getUserFullName(user) : "Admin User";
  const displayEmail = user?.email || "admin@example.com";

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-mist-300 shadow-sm">
      <div className="flex items-center justify-between px-6 lg:px-8 py-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-mist-500 group-focus-within:text-navy-600 transition-colors" />
            </div>
            <input
              type="text"
              className="
                w-full pl-11 pr-4 py-3
                bg-white
                border border-mist-300 group-focus-within:border-navy-500
                rounded-xl
                text-sm text-navy-800 placeholder-mist-500
                focus:outline-none focus:ring-2 focus:ring-navy-500/20
                transition-all duration-200
              "
              placeholder="Search resources, projects, or members..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-6">
          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="
              p-2.5 rounded-lg
              bg-white border border-mist-300
              text-navy-700
              transition-all duration-200
              hover:bg-navy-800 hover:border-navy-800 hover:text-white
              active:scale-95
            "
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Notifications */}
          <NotificationBell />

          {/* Settings */}
          <button
            className="
              p-2.5 rounded-lg
              bg-white border border-mist-300
              text-navy-700
              transition-all duration-200
              hover:bg-navy-800 hover:border-navy-800 hover:text-white
              active:scale-95
            "
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="
                p-2.5 rounded-lg
                bg-navy-800
                text-white
                transition-all duration-200
                hover:bg-navy-700
                active:scale-95
                hover:shadow-lg
              "
              aria-label="Profile"
            >
              <User className="h-5 w-5" />
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border border-mist-300 overflow-hidden">
                <div className="px-4 py-3 border-b border-mist-200">
                  <p className="font-semibold text-navy-800">{displayName}</p>
                  <p className="text-xs text-mist-500 truncate">
                    {displayEmail}
                  </p>
                </div>
                {/* Were plain <a href> tags - forced a full page reload
                    (losing all client state) on every click instead of
                    client-side navigation. */}
                <Link
                  to="/admin/profile"
                  onClick={() => setShowProfile(false)}
                  className="block w-full px-4 py-2.5 text-left text-sm text-navy-800 hover:bg-mist-100 transition-colors"
                >
                  View Profile
                </Link>
                <Link
                  to="/admin/profile/settings"
                  onClick={() => setShowProfile(false)}
                  className="block w-full px-4 py-2.5 text-left text-sm text-navy-800 hover:bg-mist-100 transition-colors"
                >
                  Account Settings
                </Link>
                <div className="border-t border-mist-200">
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={`
                      w-full px-4 py-2.5 text-left text-sm
                      ${isLoggingOut ? "text-mist-500 cursor-not-allowed" : "text-navy-800 hover:bg-mist-100"}
                      transition-colors
                    `}
                  >
                    {isLoggingOut ? "Signing out..." : "Sign Out"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
