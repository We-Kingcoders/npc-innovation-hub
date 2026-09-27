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
import {
  Users,
  Folder,
  BookOpen,
  PenLine,
  Briefcase,
  CheckSquare,
  Calendar,
  ListTodo,
  Clock,
  AlertTriangle,
} from "lucide-react";
import type { GrowthMetric } from "../../types/dashboard.types";
import { useCountUp } from "../../hooks/useCountUp";

// ─── Color map ────────────────────────────────────────────────────────────────

interface StatsCardProps {
  metric: GrowthMetric;
  loading?: boolean;
  index?: number;
  // The growth badge only means something when a caller actually tracks
  // change over a real time window (the Member dashboard's "Completed"
  // card is a genuine completion-rate percentage). The Admin dashboard's
  // version compared against a one-off localStorage snapshot from
  // whenever the dashboard first loaded in that browser - not a real
  // trend, and confusing enough that it's opted out here entirely rather
  // than displaying a number with no real meaning.
  showGrowth?: boolean;
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

// ─── Icons ────────────────────────────────────────────────────────────────────
// Real lucide-react icons throughout (previously hand-drawn inline SVG
// paths) - sharper rendering and consistent stroke weight with every other
// icon in the app.
const ICON_PATHS: Record<string, React.ReactNode> = {
  users: <Users className="w-4 h-4" />,
  folder: <Folder className="w-4 h-4" />,
  book: <BookOpen className="w-4 h-4" />,
  edit: <PenLine className="w-4 h-4" />,
  briefcase: <Briefcase className="w-4 h-4" />,
  "check-square": <CheckSquare className="w-4 h-4" />,
  calendar: <Calendar className="w-4 h-4" />,
  // Member dashboard's task stats (Total/Pending/Overdue) - "check-square"
  // above already covers "Completed".
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
  showGrowth = true,
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
        {/* Top row: icon (left) + growth badge (right, when shown) */}
        <div
          className={`w-full flex items-center ${showGrowth ? "justify-between" : "justify-center"}`}
        >
          <div className={`p-2 rounded-lg ${c.icon}`}>
            {ICON_PATHS[metric.icon ?? "folder"]}
          </div>

          {showGrowth && (
            <span
              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full
                text-[10px] font-bold ring-1 bg-navy-50 text-navy-700 ring-navy-200"
            >
              {isPositive ? (
                <svg
                  className="w-2 h-2"
                  fill="currentColor"
                  viewBox="0 0 10 10"
                >
                  <path d="M5 2l4 6H1z" />
                </svg>
              ) : isNegative ? (
                <svg
                  className="w-2 h-2"
                  fill="currentColor"
                  viewBox="0 0 10 10"
                >
                  <path d="M5 8L1 2h8z" />
                </svg>
              ) : (
                <span className="w-2 h-0.5 bg-current rounded" />
              )}
              {metric.growthPercent > 0 ? "+" : ""}
              {metric.growthPercent}%
            </span>
          )}
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
