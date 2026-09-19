import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, User, Search } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getUserFullName } from "../../types/user.types";
import NotificationBell from "../notifications/NotificationBell";

// sticky + a working profile dropdown, matching admin-components/Topbar.tsx's
// pattern exactly (same shell language, see the Member/Admin UI-parity work) -
// the previous UserCircle button here had no onClick at all, and the large
// avatar/name/role block that used to live in Sidebar.tsx is gone now that
// this dropdown is the one place profile access lives.
export const Topbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setShowProfile(false);
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const displayName = user ? getUserFullName(user) : "Member";
  const displayEmail = user?.email || "";

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-mist-300 shadow-sm flex items-center justify-between gap-4 py-6 px-4 sm:px-10">
      {/* Search Bar - was a hardcoded w-[540px], which overflowed the
          viewport on any screen narrower than ~540px plus the icons and
          padding (every phone, and many tablets in portrait). Now grows up
          to that same 540px on room enough, shrinks to fit otherwise. */}
      <div className="w-full min-w-0 max-w-[540px]">
        <div className="bg-white border border-mist-300 rounded-xl shadow-sm flex items-center px-4 sm:px-6 py-3 focus-within:border-navy-500 transition-colors">
          <Search className="text-mist-500 mr-3 flex-shrink-0" size={20} />
          <input
            className="w-full min-w-0 outline-none border-none bg-transparent text-sm text-navy-800 placeholder:text-mist-500"
            placeholder="Search a resource or project"
          />
        </div>
      </div>

      {/* Icons Section */}
      <div className="flex gap-3 items-center flex-shrink-0">
        <NotificationBell />

        <Link
          to="/messages"
          title="Messages"
          className="w-10 h-10 rounded-xl bg-white border border-mist-300 text-navy-700
                     flex items-center justify-center shadow-sm transition-colors
                     hover:bg-navy-800 hover:border-navy-800 hover:text-white"
        >
          <Mail size={20} />
        </Link>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile((s) => !s)}
            aria-expanded={showProfile}
            aria-haspopup="true"
            aria-label="Profile"
            className="w-10 h-10 rounded-xl bg-navy-800 text-white
                       flex items-center justify-center shadow-sm transition-colors
                       hover:bg-navy-700"
          >
            <User size={20} />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border border-mist-300 overflow-hidden z-20">
              <div className="px-4 py-3 border-b border-mist-200">
                <p className="font-semibold text-navy-800">{displayName}</p>
                {displayEmail && (
                  <p className="text-xs text-mist-500 truncate">
                    {displayEmail}
                  </p>
                )}
              </div>
              <Link
                to="/dashboard/profile"
                onClick={() => setShowProfile(false)}
                className="block w-full px-4 py-2.5 text-left text-sm text-navy-800 hover:bg-mist-100 transition-colors"
              >
                View Profile
              </Link>
              <Link
                to="/dashboard/edit-profile"
                onClick={() => setShowProfile(false)}
                className="block w-full px-4 py-2.5 text-left text-sm text-navy-800 hover:bg-mist-100 transition-colors"
              >
                Account Settings
              </Link>
              <div className="border-t border-mist-200">
                <button
                  onClick={() => void handleLogout()}
                  disabled={isLoggingOut}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                    isLoggingOut
                      ? "text-mist-500 cursor-not-allowed"
                      : "text-navy-800 hover:bg-mist-100"
                  }`}
                >
                  {isLoggingOut ? "Signing out..." : "Sign Out"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
