// ============================================================
// EventInsightsWidget.tsx
// Upcoming events, attendance totals, engagement rate
// ============================================================

import React from "react";
import type { EventInsightsData } from "../../../types/dashboard.types";

interface EventInsightsWidgetProps {
  insights: EventInsightsData | null;
  loading: boolean;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDaysUntil(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr);
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

const SkeletonWidget: React.FC = () => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">
    <div className="w-32 h-5 bg-gray-200 rounded mb-4" />
    <div className="grid grid-cols-3 gap-3 mb-5">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-100 rounded-xl p-3 space-y-2">
          <div className="w-8 h-6 bg-gray-200 rounded" />
          <div className="w-16 h-3 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 bg-gray-200 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="w-3/4 h-3 bg-gray-200 rounded" />
            <div className="w-1/2 h-3 bg-gray-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EventInsightsWidget: React.FC<EventInsightsWidgetProps> = ({
  insights,
  loading,
}) => {
  if (loading) return <SkeletonWidget />;

  if (!insights) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-center h-72">
        <p className="text-gray-400 text-sm">No event data available</p>
      </div>
    );
  }

  const summaryStats = [
    {
      label: "Total Events",
      value: insights.total,
      color: "text-indigo-700",
      bg: "bg-indigo-50",
    },
    {
      label: "Attendees",
      value: insights.totalAttendees,
      color: "text-emerald-700",
      bg: "bg-emerald-50",
    },
    {
      label: "Engagement",
      value: `${insights.engagementRate}%`,
      color: "text-orange-700",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">
            Event Insights
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {insights.upcoming.length} upcoming events
          </p>
        </div>
        <div className="p-2 bg-indigo-50 rounded-xl">
          <svg
            className="w-4 h-4 text-indigo-600"
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
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {summaryStats.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bg} rounded-xl p-3 text-center`}
          >
            <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming Events List */}
      <div className="space-y-2">
        {insights.upcoming.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-400 text-xs">No upcoming events</p>
          </div>
        ) : (
          insights.upcoming.slice(0, 4).map((event) => {
            const daysUntil = getDaysUntil(event.date);
            const isImminent = daysUntil <= 3;

            return (
              <div
                key={event._id}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-150 group"
              >
                {/* Date Badge */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-xl flex flex-col items-center justify-center text-center
                    ${isImminent ? "bg-rose-100 text-rose-700" : "bg-indigo-100 text-indigo-700"}`}
                >
                  <span className="text-xs font-bold leading-none">
                    {new Date(event.date).getDate()}
                  </span>
                  <span className="text-[9px] uppercase leading-none mt-0.5">
                    {new Date(event.date).toLocaleString("en-US", {
                      month: "short",
                    })}
                  </span>
                </div>

                {/* Event Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {event.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatDate(event.date)}
                  </p>
                </div>

                {/* Days Until Badge */}
                <span
                  className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full
                    ${
                      daysUntil === 0
                        ? "bg-rose-100 text-rose-700"
                        : daysUntil <= 3
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-200 text-gray-500"
                    }
                  `}
                >
                  {daysUntil === 0 ? "Today" : `${daysUntil}d`}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EventInsightsWidget;
