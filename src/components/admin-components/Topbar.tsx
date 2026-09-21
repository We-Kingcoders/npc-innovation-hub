import { Sun, Moon, User, Settings } from "lucide-react";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getUserFullName } from "../../types/user.types";
import type { User as AppUser } from "../../types/user.types";
import type { Resource } from "../../types/resource.types";
import type { Project } from "../../types/project.types";
import NotificationBell from "../notifications/NotificationBell";
import TopbarSearch, { type SearchSection } from "../ui/TopbarSearch";
import { getAllResources } from "../../api/admin/resource.api";
import { searchProjects } from "../../api/admin/project.api";
import { getAllUsers, searchUsers } from "../../api/admin/member.api";

const RESULTS_CAP = 5;

export default function Topbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [resourceResults, setResourceResults] = useState<Resource[]>([]);
  const [projectResults, setProjectResults] = useState<Project[]>([]);
  const [memberResults, setMemberResults] = useState<AppUser[]>([]);
  // Fetched once, lazily, on the first search - member search has no
  // dedicated backend search endpoint (only a client-side filter over
  // the full list, same as MembersManagement.tsx already does), so this
  // avoids refetching the whole user list on every keystroke.
  const allUsersRef = useRef<AppUser[] | null>(null);
  const navigate = useNavigate();

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

  // Real search against the same domains AdminResources/ProjectsTable/
  // MembersManagement already manage - the search bar used to be
  // entirely decorative (no value, no onChange, no handler at all).
  const handleSearch = async (query: string) => {
    if (!query) {
      setResourceResults([]);
      setProjectResults([]);
      setMemberResults([]);
      return;
    }
    setSearchLoading(true);
    try {
      const usersPromise: Promise<AppUser[]> = allUsersRef.current
        ? Promise.resolve(allUsersRef.current)
        : getAllUsers().then((users) => {
            allUsersRef.current = users;
            return users;
          });

      const [resourcesResult, projectsResult, usersResult] =
        await Promise.allSettled([
          getAllResources({ search: query, limit: RESULTS_CAP }),
          searchProjects(query),
          usersPromise,
        ]);

      setResourceResults(
        resourcesResult.status === "fulfilled"
          ? resourcesResult.value.data.resources.slice(0, RESULTS_CAP)
          : [],
      );
      setProjectResults(
        projectsResult.status === "fulfilled"
          ? projectsResult.value.data.projects.slice(0, RESULTS_CAP)
          : [],
      );
      setMemberResults(
        usersResult.status === "fulfilled"
          ? searchUsers(usersResult.value, query).slice(0, RESULTS_CAP)
          : [],
      );
    } finally {
      setSearchLoading(false);
    }
  };

  const goToResources = (query: string) =>
    navigate(`/resources?q=${encodeURIComponent(query)}`);
  const goToProjects = (query: string) =>
    navigate(`/Admin-projects?q=${encodeURIComponent(query)}`);
  const goToMembers = (query: string) =>
    navigate(`/Admin-members?q=${encodeURIComponent(query)}`);

  const sections: SearchSection[] = [
    {
      key: "resources",
      label: "Resources",
      items: resourceResults.map((r) => ({
        id: r.id,
        label: r.title,
        sublabel: r.category,
        onSelect: () => goToResources(r.title),
      })),
    },
    {
      key: "projects",
      label: "Projects",
      items: projectResults.map((p) => ({
        id: p.id,
        label: p.title,
        sublabel: p.owner,
        onSelect: () => goToProjects(p.title),
      })),
    },
    {
      key: "members",
      label: "Members",
      items: memberResults.map((m) => ({
        id: m.id,
        label: getUserFullName(m),
        sublabel: m.email,
        onSelect: () => goToMembers(getUserFullName(m)),
      })),
    },
  ];

  // Enter with no specific result picked - land on whichever section
  // actually has matches, defaulting to Resources when several (or none)
  // do.
  const handleSubmit = (query: string) => {
    if (resourceResults.length === 0 && projectResults.length > 0) {
      goToProjects(query);
    } else if (
      resourceResults.length === 0 &&
      projectResults.length === 0 &&
      memberResults.length > 0
    ) {
      goToMembers(query);
    } else {
      goToResources(query);
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-mist-300 shadow-sm">
      <div className="flex items-center justify-between px-6 lg:px-8 py-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <TopbarSearch
            placeholder="Search resources, projects, or members..."
            loading={searchLoading}
            sections={sections}
            onSearch={handleSearch}
            onSubmit={handleSubmit}
          />
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
