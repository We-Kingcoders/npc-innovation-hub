import { Search, Sun, Moon, Bell, User, Settings } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getUserFullName } from "../../types/user.types";

export default function Topbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
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
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 lg:px-8 py-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              className="
                w-full pl-11 pr-4 py-3
                bg-gray-50 group-focus-within:bg-white
                border border-gray-200 group-focus-within:border-blue-400
                rounded-xl
                text-sm text-gray-700 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-400/20
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
              bg-gray-100 hover:bg-gray-200
              text-gray-700
              transition-all duration-200
              hover:scale-105
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
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="
                relative p-2.5 rounded-lg
                bg-gray-100 hover:bg-gray-200
                text-gray-700
                transition-all duration-200
                hover:scale-105
                active:scale-95
              "
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    You have 3 unread notifications
                  </p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition-colors"
                    >
                      <p className="text-sm text-gray-900 font-medium">
                        New hire request received
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        2 minutes ago
                      </p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 text-center border-t border-gray-100">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button
            className="
              p-2.5 rounded-lg
              bg-gray-100 hover:bg-gray-200
              text-gray-700
              transition-all duration-200
              hover:scale-105
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
                bg-gradient-to-br from-blue-500 to-indigo-600
                text-white
                transition-all duration-200
                hover:scale-105
                active:scale-95
                hover:shadow-lg
              "
              aria-label="Profile"
            >
              <User className="h-5 w-5" />
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-gray-900">{displayName}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {displayEmail}
                  </p>
                </div>
                <a
                  href="/admin/profile"
                  className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  View Profile
                </a>
                <a
                  href="/admin/profile/settings"
                  className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Account Settings
                </a>
                <div className="border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={`
                      w-full px-4 py-2.5 text-left text-sm 
                      ${isLoggingOut ? "text-gray-400 cursor-not-allowed" : "text-red-600 hover:bg-red-50"}
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
