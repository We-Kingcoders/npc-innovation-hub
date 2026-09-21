import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, User } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getUserFullName } from "../../types/user.types";
import { useConversations } from "../../hooks/useDirectMessages";
import NotificationBell from "../notifications/NotificationBell";
import TopbarSearch, { type SearchSection } from "../ui/TopbarSearch";
import { searchResources } from "../../api/member/resource.api";
import { searchProjects } from "../../api/member/project.api";
import type {
  Resource,
  PaginatedResourcesResponse,
} from "../../types/resource.types";
import type { MemberProject } from "../../api/member/project.api";

const RESULTS_CAP = 5;

// sticky + a working profile dropdown, matching admin-components/Topbar.tsx's
// pattern exactly (same shell language, see the Member/Admin UI-parity work) -
// the previous UserCircle button here had no onClick at all, and the large
// avatar/name/role block that used to live in Sidebar.tsx is gone now that
// this dropdown is the one place profile access lives.
export const Topbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { conversations } = useConversations();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [resourceResults, setResourceResults] = useState<Resource[]>([]);
  const [projectResults, setProjectResults] = useState<MemberProject[]>([]);

  // Real unread-messages count (same live-polled/socket-pushed hook the
  // Messages page itself uses) - the dashboard used to also carry a full
  // MessagesPreview widget with its own "No conversations yet" empty
  // state; Admin's dashboard has no messages widget at all, so that
  // block was dropped and this badge is the lightweight replacement for
  // it, matching NotificationBell's own badge treatment.
  const unreadMessagesCount = conversations.reduce(
    (sum, conversation) => sum + (conversation.unreadCount || 0),
    0,
  );

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

  // Real search against the same backend endpoints the Resources and
  // Projects pages already use - the search bar used to be entirely
  // decorative (no value, no onChange, no handler at all).
  const handleSearch = async (query: string) => {
    if (!query) {
      setResourceResults([]);
      setProjectResults([]);
      return;
    }
    setSearchLoading(true);
    try {
      const [resourcesResult, projectsResult] = await Promise.allSettled([
        searchResources(query),
        searchProjects(query),
      ]);

      setResourceResults(
        resourcesResult.status === "fulfilled"
          ? (
              resourcesResult.value.data as PaginatedResourcesResponse
            ).data.resources.slice(0, RESULTS_CAP)
          : [],
      );
      setProjectResults(
        projectsResult.status === "fulfilled"
          ? projectsResult.value.data.projects.slice(0, RESULTS_CAP)
          : [],
      );
    } finally {
      setSearchLoading(false);
    }
  };

  const goToResources = (query: string) =>
    navigate(`/dashboard/resources?q=${encodeURIComponent(query)}`);
  const goToProjects = (query: string) =>
    navigate(`/dashboard/projects?q=${encodeURIComponent(query)}`);

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
  ];

  // Enter with no specific result picked - land wherever there's
  // something to show, defaulting to Resources when both (or neither)
  // have matches.
  const handleSubmit = (query: string) => {
    if (resourceResults.length === 0 && projectResults.length > 0) {
      goToProjects(query);
    } else {
      goToResources(query);
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-mist-300 shadow-sm flex items-center justify-between gap-4 py-6 px-4 sm:px-10">
      <div className="w-full min-w-0 max-w-[540px]">
        <TopbarSearch
          placeholder="Search a resource or project"
          loading={searchLoading}
          sections={sections}
          onSearch={handleSearch}
          onSubmit={handleSubmit}
        />
      </div>

      {/* Icons Section */}
      <div className="flex gap-3 items-center flex-shrink-0">
        <NotificationBell />

        <Link
          to="/messages"
          title="Messages"
          className="relative w-10 h-10 rounded-xl bg-white border border-mist-300 text-navy-700
                     flex items-center justify-center shadow-sm transition-colors
                     hover:bg-navy-800 hover:border-navy-800 hover:text-white"
        >
          <Mail size={20} />
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white">
              {unreadMessagesCount > 99 ? "99+" : unreadMessagesCount}
            </span>
          )}
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
