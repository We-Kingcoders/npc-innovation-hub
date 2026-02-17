// ============================================================
// ActivityFeed.tsx
// Recent admin activity feed with icons and relative timestamps
// ============================================================

import React from "react";
import type {
  ActivityItem,
  ActivityType,
} from "../../../types/dashboard.types";

interface ActivityFeedProps {
  activities: ActivityItem[];
  loading: boolean;
}

function timeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return then.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const ACTIVITY_CONFIG: Record<
  ActivityType,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  project_created: {
    icon: (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
    ),
    color: "text-indigo-600",
    bg: "bg-indigo-100",
  },
  task_assigned: {
    icon: (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
        />
        <rect x="9" y="3" width="6" height="4" rx="1" />
      </svg>
    ),
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  task_completed: {
    icon: (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  event_created: {
    icon: (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    color: "text-violet-600",
    bg: "bg-violet-100",
  },
  resource_added: {
    icon: (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 19.5A2.5 2.5 0 016.5 17H20"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
        />
      </svg>
    ),
    color: "text-teal-600",
    bg: "bg-teal-100",
  },
  blog_published: {
    icon: (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"
        />
      </svg>
    ),
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  hire_inquiry: {
    icon: (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
        />
      </svg>
    ),
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
  user_joined: {
    icon: (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
        />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
      </svg>
    ),
    color: "text-green-600",
    bg: "bg-green-100",
  },
  member_updated: {
    icon: (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
        />
        <circle cx="9" cy="7" r="4" />
        <polyline points="16 11 18 13 22 9" />
      </svg>
    ),
    color: "text-gray-600",
    bg: "bg-gray-100",
  },
};

const SkeletonItem: React.FC = () => (
  <div className="flex gap-3 animate-pulse">
    <div className="w-7 h-7 bg-gray-200 rounded-full flex-shrink-0 mt-0.5" />
    <div className="flex-1 pt-0.5 space-y-1.5">
      <div className="w-24 h-3 bg-gray-200 rounded" />
      <div className="w-40 h-3 bg-gray-100 rounded" />
    </div>
    <div className="w-12 h-3 bg-gray-100 rounded flex-shrink-0" />
  </div>
);

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, loading }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">
            Recent Activity
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Latest system events</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-xs text-gray-400">Live</span>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonItem key={i} />)
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-5 h-5 text-gray-300"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-400 text-xs">No recent activity</p>
          </div>
        ) : (
          activities.map((activity, idx) => {
            const config =
              ACTIVITY_CONFIG[activity.type] ?? ACTIVITY_CONFIG.project_created;
            const isLast = idx === activities.length - 1;

            return (
              <div key={activity.id} className="relative flex gap-3 group">
                {/* Connector line */}
                {!isLast && (
                  <div className="absolute left-3.5 top-7 bottom-0 w-px bg-gray-100" />
                )}

                {/* Icon */}
                <div
                  className={`relative z-10 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 ${config.bg} ${config.color}`}
                >
                  {config.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-xs font-semibold text-gray-700">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {activity.description}
                  </p>
                </div>

                {/* Timestamp */}
                <span className="flex-shrink-0 text-xs text-gray-400 pt-0.5">
                  {timeAgo(activity.timestamp)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
