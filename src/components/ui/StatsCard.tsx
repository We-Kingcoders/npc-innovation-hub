// ============================================================
// StatsCard.tsx
// KPI card — animated count-up + colored circular number bg
//
// Shared between the Admin dashboard (ModernStatsCards.tsx) and the Member
// dashboard (dashboard/StatsCards.tsx) - was admin-only, but the component
// itself was already generic (takes a plain metric prop, no admin-specific
// data or permission logic), just misfiled under admin-components. Moved
// here rather than duplicated so both dashboards share one implementation
// and visual language.
// ============================================================

import React from "react";
import { ListTodo, Clock, AlertTriangle } from "lucide-react";
import type { GrowthMetric } from "../../types/dashboard.types";
import { useCountUp } from "../../hooks/useCountUp";

// ─── Color map ────────────────────────────────────────────────────────────────

interface StatsCardProps {
  metric: GrowthMetric;
  loading?: boolean;
  index?: number;
}

// All metric types share one navy/mist look — no per-metric rainbow coding.
const NAVY_CARD = {
  cardBg: "from-mist-50 to-white",
  border: "border-mist-300",
  glow: "hover:shadow-mist-200",
  icon: "bg-navy-50 text-navy-700",
  numBg: "bg-navy-800",
  numText: "text-white",
  cornerAccent: "bg-navy-50",
};

const COLOR_MAP: Record<GrowthMetric["color"], typeof NAVY_CARD> = {
  blue: NAVY_CARD,
  green: NAVY_CARD,
  purple: NAVY_CARD,
  orange: NAVY_CARD,
  red: NAVY_CARD,
  indigo: NAVY_CARD,
  teal: NAVY_CARD,
};

// ─── Icon paths ───────────────────────────────────────────────────────────────

const ICON_PATHS: Record<string, React.ReactNode> = {
  users: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-4 h-4"
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
      className="w-4 h-4"
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
      className="w-4 h-4"
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
      className="w-4 h-4"
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
      className="w-4 h-4"
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
      className="w-4 h-4"
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
      className="w-4 h-4"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  // Added for the Member dashboard's task stats (Total/Pending/Overdue) -
  // matches the lucide icons its previous, unshared StatsCards.tsx used
  // (ListTodo/Clock/AlertTriangle), rather than settling for a mismatched
  // icon from the admin-authored set above. "check-square" above already
  // covers "Completed".
  "list-todo": <ListTodo className="w-4 h-4" />,
  clock: <Clock className="w-4 h-4" />,
  "alert-triangle": <AlertTriangle className="w-4 h-4" />,
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export const StatsCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-5 border border-mist-300 shadow-sm animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="w-8 h-8 bg-mist-200 rounded-lg" />
      <div className="w-12 h-5 bg-mist-200 rounded-full" />
    </div>
    {/* Circular number skeleton */}
    <div className="w-16 h-16 bg-mist-200 rounded-full mx-auto mb-3" />
    <div className="w-20 h-3 bg-mist-200 rounded mx-auto" />
  </div>
);

// ─── Card ─────────────────────────────────────────────────────────────────────

const StatsCard: React.FC<StatsCardProps> = ({
  metric,
  loading,
  index = 0,
}) => {
  const displayValue = useCountUp(
    loading || typeof metric.value !== "number" ? 0 : metric.value,
  );

  if (loading) return <StatsCardSkeleton />;

  const c = COLOR_MAP[metric.color];
  const isPositive = metric.trend === "up";
  const isNegative = metric.trend === "down";

  return (
    <div
      style={{
        animationDelay: `${index * 60}ms`,
        animationFillMode: "backwards",
      }}
      className={`
        group relative isolate bg-gradient-to-b ${c.cardBg}
        rounded-2xl p-5 border ${c.border}
        shadow-sm hover:shadow-lg ${c.glow}
        transition-all duration-300 hover:-translate-y-0.5
        overflow-hidden cursor-default animate-slide-up
      `}
    >
      {/* Decorative corner circle */}
      <div
        className={`absolute -top-6 -right-6 w-20 h-20 rounded-full ${c.cornerAccent}
          opacity-40 group-hover:opacity-70 transition-opacity duration-300`}
      />

      <div className="relative flex flex-col items-center text-center gap-3">
        {/* Top row: icon (left) + growth badge (right) */}
        <div className="w-full flex items-center justify-between">
          <div className={`p-2 rounded-lg ${c.icon}`}>
            {ICON_PATHS[metric.icon ?? "folder"]}
          </div>

          {/* Growth badge */}
          <span
            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full
              text-[10px] font-bold ring-1 bg-navy-50 text-navy-700 ring-navy-200"
          >
            {isPositive ? (
              <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 10 10">
                <path d="M5 2l4 6H1z" />
              </svg>
            ) : isNegative ? (
              <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 10 10">
                <path d="M5 8L1 2h8z" />
              </svg>
            ) : (
              <span className="w-2 h-0.5 bg-current rounded" />
            )}
            {metric.growthPercent > 0 ? "+" : ""}
            {metric.growthPercent}%
          </span>
        </div>

        {/* Colored circle with animated count-up number */}
        <div
          className={`
            w-16 h-16 rounded-full ${c.numBg} ${c.numText}
            flex items-center justify-center
            shadow-md
            transition-transform duration-200 group-hover:scale-105
          `}
        >
          <span className="text-xl font-bold tabular-nums leading-none">
            {displayValue.toLocaleString()}
          </span>
        </div>

        {/* Label */}
        <p className="text-xs font-semibold text-navy-700 leading-tight">
          {metric.label}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;
