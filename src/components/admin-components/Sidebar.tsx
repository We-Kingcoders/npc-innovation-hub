// src/components/admin-components/Sidebar.tsx
// Updated to include "messages" icon and route.

import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Mail,
  FolderOpen,
  Briefcase,
  FileText,
  Users,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  Calendar,
  ClipboardList,
  MessageSquare, // ← new
  UserCheck, // ← new
  Star, // ← new
  Video, // ← new
  GraduationCap, // ← new
} from "lucide-react";
import { sidebarLinks } from "../../data/admin-data/sidebarLinks";
import { useAuth } from "../../hooks/useAuth";
import { getPendingHireInquiriesCount } from "../../api/admin/hire.api";
import SkipToContent from "../SkipToContent";

// How often to re-poll the pending-hire-inquiries count for the sidebar badge.
const HIRE_BADGE_POLL_MS = 45_000;
const HIRE_REQUESTS_LABEL = "Hire Us Requests";

const iconComponents = {
  dashboard: LayoutDashboard,
  notification: Mail,
  resources: FolderOpen,
  projects: Briefcase,
  blog: FileText,
  members: Users,
  calendar: Calendar,
  clipboard: ClipboardList,
  messages: MessageSquare, // ← new
  applications: UserCheck, // ← new
  heroMembers: Star, // ← new
  hubVideo: Video, // ← new
  alumni: GraduationCap, // ← new
};

export default function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { logout } = useAuth();

  // Real pending-hire-inquiries count for the "Hire Us Requests" badge.
  // null until the first successful fetch, so the link renders with no badge
  // rather than a stale/fake number while loading or if the request fails.
  const [pendingHireCount, setPendingHireCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadCount = async () => {
      try {
        const count = await getPendingHireInquiriesCount();
        if (!cancelled) setPendingHireCount(count);
      } catch (error) {
        console.error("Failed to load pending hire inquiries count:", error);
      }
    };

    void loadCount();
    const interval = setInterval(() => void loadCount(), HIRE_BADGE_POLL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // A route is "active" if the pathname starts with the link path
  // (covers /admin/messages/:id, /admin/hub-channel, etc.)
  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

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
      <SkipToContent />
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <aside
        className={`
          fixed lg:sticky inset-y-0 lg:inset-y-auto lg:top-0 left-0 z-30
          ${isCollapsed ? "-translate-x-full lg:w-20" : "translate-x-0 w-64"}
          lg:translate-x-0
          bg-navy-800
          h-screen flex flex-col
          transition-all duration-300 ease-in-out
          shadow-2xl
        `}
      >
        {/* Mobile-only off-canvas toggle - stays outside the brand row (and
            outside <aside> entirely when collapsed, see the floating button
            at the bottom of this file) since the whole sidebar translates
            off-screen on mobile; it needs to remain reachable independent
            of that. */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="lg:hidden absolute -right-12 top-6 bg-navy-800 text-white p-2 rounded-r-lg shadow-lg"
        >
          {isCollapsed ? (
            <ChevronsRight size={20} />
          ) : (
            <ChevronsLeft size={20} />
          )}
        </button>

        {/* Brand + desktop collapse toggle share one row, the toggle at the
            row's end rather than floating outside the sidebar's own edge.
            Own profile access (avatar, name, View Profile/Profile Settings)
            lives in Topbar.tsx's top-right profile icon - not duplicated
            here too. */}
        <div
          className={`flex items-center flex-shrink-0 border-b border-navy-700 pt-5 pb-3 ${
            isCollapsed ? "justify-center px-3" : "justify-between px-6"
          }`}
        >
          {!isCollapsed && (
            <span className="text-sm font-extrabold tracking-tight text-white whitespace-nowrap truncate">
              NPC INNOVATION HUB
            </span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden lg:flex items-center justify-center flex-shrink-0 bg-white text-navy-800 p-1.5 rounded-full shadow-md hover:shadow-lg transition-shadow"
          >
            {isCollapsed ? (
              <ChevronsRight size={16} />
            ) : (
              <ChevronsLeft size={16} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-3 overflow-y-auto hide-scrollbar">
          <ul className="space-y-1">
            {sidebarLinks.map(({ icon, label, notification, path }) => {
              const IconComponent =
                iconComponents[icon as keyof typeof iconComponents];
              const active = isActive(path);
              const badgeCount =
                label === HIRE_REQUESTS_LABEL && pendingHireCount !== null
                  ? pendingHireCount
                  : notification;

              return (
                <li key={label}>
                  <Link
                    to={path}
                    className={`
                      group flex items-center gap-3 px-3 py-2 rounded-lg
                      transition-all duration-200 min-w-0
                      ${isCollapsed ? "justify-center" : ""}
                      ${
                        active
                          ? "bg-navy-700 shadow-md border-l-4 border-white font-bold"
                          : "text-navy-100 hover:bg-navy-700 hover:text-white hover:font-bold"
                      }
                    `}
                    title={isCollapsed ? label : undefined}
                  >
                    <div className="relative flex-shrink-0">
                      <div
                        className={`p-1.5 rounded-lg transition-colors duration-200 ${
                          active
                            ? "bg-white text-navy-800"
                            : "bg-navy-700 text-navy-100 group-hover:bg-navy-600 group-hover:text-white"
                        }`}
                      >
                        {IconComponent && (
                          <IconComponent size={18} strokeWidth={2.5} />
                        )}
                      </div>
                      {badgeCount > 0 && (
                        <span
                          className={`absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-white text-navy-800 ring-2 ring-navy-800 text-[10px] font-bold rounded-full flex items-center justify-center ${isCollapsed ? "scale-90" : ""}`}
                        >
                          {badgeCount > 99 ? "99+" : badgeCount}
                        </span>
                      )}
                    </div>
                    {!isCollapsed && (
                      <span
                        className={`flex-1 min-w-0 truncate text-sm uppercase ${active ? "text-white" : "text-navy-100"} group-hover:text-white transition-colors duration-200`}
                      >
                        {label}
                      </span>
                    )}
                    {!isCollapsed && badgeCount > 0 && (
                      <span className="ml-auto flex-shrink-0 bg-white text-navy-800 text-xs font-bold px-2 py-0.5 rounded-full">
                        {badgeCount > 99 ? "99+" : badgeCount}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="px-4 pb-4 mt-auto flex-shrink-0">
          <button
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border border-navy-600 hover:bg-white hover:border-white hover:font-bold uppercase text-sm text-navy-100 hover:text-navy-800 transition-all duration-200 group ${isCollapsed ? "justify-center px-3" : ""} ${isLoggingOut ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut
              size={20}
              className={`group-hover:scale-110 transition-transform ${isLoggingOut ? "animate-spin" : ""}`}
            />
            {!isCollapsed && (
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            )}
          </button>
        </div>
      </aside>

      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          aria-label="Expand sidebar"
          className="lg:hidden fixed bottom-6 left-6 z-50 bg-navy-800 text-white p-4 rounded-full shadow-2xl"
        >
          <ChevronsRight size={24} />
        </button>
      )}
    </>
  );
}
