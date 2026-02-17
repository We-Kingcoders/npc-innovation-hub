// ============================================================
// StatsCard.tsx
// Reusable KPI card with growth indicator and glassmorphism
// ============================================================

import React from "react";
import type { GrowthMetric } from "../../../types/dashboard.types";

interface StatsCardProps {
  metric: GrowthMetric;
  loading?: boolean;
}

const COLOR_MAP: Record<
  GrowthMetric["color"],
  { bg: string; icon: string; badge: string; glow: string; border: string }
> = {
  blue: {
    bg: "from-blue-500/10 to-blue-600/5",
    icon: "bg-blue-500/15 text-blue-600",
    badge: "bg-blue-50 text-blue-700 ring-blue-200",
    glow: "shadow-blue-100",
    border: "border-blue-100",
  },
  green: {
    bg: "from-emerald-500/10 to-emerald-600/5",
    icon: "bg-emerald-500/15 text-emerald-600",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    glow: "shadow-emerald-100",
    border: "border-emerald-100",
  },
  purple: {
    bg: "from-violet-500/10 to-violet-600/5",
    icon: "bg-violet-500/15 text-violet-600",
    badge: "bg-violet-50 text-violet-700 ring-violet-200",
    glow: "shadow-violet-100",
    border: "border-violet-100",
  },
  orange: {
    bg: "from-orange-500/10 to-orange-600/5",
    icon: "bg-orange-500/15 text-orange-600",
    badge: "bg-orange-50 text-orange-700 ring-orange-200",
    glow: "shadow-orange-100",
    border: "border-orange-100",
  },
  red: {
    bg: "from-rose-500/10 to-rose-600/5",
    icon: "bg-rose-500/15 text-rose-600",
    badge: "bg-rose-50 text-rose-700 ring-rose-200",
    glow: "shadow-rose-100",
    border: "border-rose-100",
  },
  indigo: {
    bg: "from-indigo-500/10 to-indigo-600/5",
    icon: "bg-indigo-500/15 text-indigo-600",
    badge: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    glow: "shadow-indigo-100",
    border: "border-indigo-100",
  },
  teal: {
    bg: "from-teal-500/10 to-teal-600/5",
    icon: "bg-teal-500/15 text-teal-600",
    badge: "bg-teal-50 text-teal-700 ring-teal-200",
    glow: "shadow-teal-100",
    border: "border-teal-100",
  },
};

const ICON_PATHS: Record<string, React.ReactNode> = {
  users: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
      />
      <circle cx="9" cy="7" r="4" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M23 21v-2a4 4 0 0 0-3-3.87"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 3.13a4 4 0 0 1 0 7.75"
      />
    </svg>
  ),
  folder: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
      />
    </svg>
  ),
  book: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-5 h-5"
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
  edit: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
      />
    </svg>
  ),
  briefcase: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-5 h-5"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
      />
    </svg>
  ),
  "check-square": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-5 h-5"
    >
      <polyline points="9 11 12 14 22 4" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
      />
    </svg>
  ),
  calendar: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-5 h-5"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
};

export const StatsCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 bg-gray-200 rounded-xl" />
      <div className="w-14 h-5 bg-gray-200 rounded-full" />
    </div>
    <div className="w-16 h-8 bg-gray-200 rounded-lg mb-1" />
    <div className="w-24 h-4 bg-gray-100 rounded" />
  </div>
);

const StatsCard: React.FC<StatsCardProps> = ({ metric, loading }) => {
  if (loading) return <StatsCardSkeleton />;

  const colors = COLOR_MAP[metric.color];
  const isPositive = metric.trend === "up";
  const isNegative = metric.trend === "down";

  return (
    <div
      className={`
        group relative bg-white rounded-2xl p-5 border ${colors.border}
        shadow-sm hover:shadow-lg ${colors.glow}
        transition-all duration-300 hover:-translate-y-0.5
        overflow-hidden cursor-default
      `}
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-60 pointer-events-none`}
      />

      {/* Subtle corner accent */}
      <div
        className={`absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br ${colors.bg} rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-300`}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2.5 rounded-xl ${colors.icon}`}>
            {ICON_PATHS[metric.icon ?? "folder"]}
          </div>

          {/* Growth badge */}
          <span
            className={`
              inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ring-1
              ${
                isPositive
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                  : isNegative
                    ? "bg-rose-50 text-rose-700 ring-rose-200"
                    : "bg-gray-50 text-gray-500 ring-gray-200"
              }
            `}
          >
            {isPositive ? (
              <svg
                className="w-2.5 h-2.5"
                fill="currentColor"
                viewBox="0 0 10 10"
              >
                <path d="M5 2l4 6H1z" />
              </svg>
            ) : isNegative ? (
              <svg
                className="w-2.5 h-2.5"
                fill="currentColor"
                viewBox="0 0 10 10"
              >
                <path d="M5 8L1 2h8z" />
              </svg>
            ) : (
              <span className="w-2.5 h-0.5 bg-current rounded" />
            )}
            {metric.growthPercent > 0 ? "+" : ""}
            {metric.growthPercent}%
          </span>
        </div>

        {/* Value */}
        <div className="mb-1">
          <span className="text-3xl font-bold text-gray-900 tracking-tight">
            {metric.value.toLocaleString()}
          </span>
          {metric.unit && (
            <span className="ml-1 text-sm text-gray-400">{metric.unit}</span>
          )}
        </div>

        {/* Label */}
        <p className="text-sm text-gray-500 font-medium">{metric.label}</p>
      </div>
    </div>
  );
};

export default StatsCard;
