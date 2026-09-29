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
  <div className="bg-white rounded-2xl p-4 sm:p-5 border border-mist-300 shadow-sm animate-pulse flex flex-col gap-6">
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 bg-mist-200 rounded-lg flex-shrink-0" />
      <div className="w-16 h-3 bg-mist-200 rounded" />
    </div>
    <div className="w-14 h-8 bg-mist-200 rounded" />
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
        rounded-2xl p-4 sm:p-5 border ${c.border}
        shadow-sm hover:shadow-lg ${c.glow}
        transition-all duration-300 hover:-translate-y-0.5
        overflow-hidden cursor-default animate-slide-up
        flex flex-col gap-6
      `}
    >
      {/* Decorative corner circle */}
      <div
        className={`absolute -top-6 -right-6 w-20 h-20 rounded-full ${c.cornerAccent}
          opacity-40 group-hover:opacity-70 transition-opacity duration-300`}
      />

      {/* Header row: icon immediately followed by the card's own name,
          not a separate icon-alone corner with the label stranded below
          the number - the icon exists to label the card, so it reads
          better right next to what it's labeling. */}
      <div className="relative flex items-center gap-2 min-w-0">
        <div className={`p-1.5 rounded-lg flex-shrink-0 ${c.icon}`}>
          {ICON_PATHS[metric.icon ?? "folder"]}
        </div>
        <p className="text-xs font-semibold text-navy-700 leading-tight truncate">
          {metric.label}
        </p>
      </div>

      {/* The count itself, directly on the card - no circular chip
          behind it. A plain large number reads as more professional
          data-density here than a decorative badge shape competing with
          the icon+label above for the same "this is the important part"
          attention. */}
      <div className="relative flex items-end justify-between gap-2">
        <span className="text-3xl sm:text-4xl font-bold tabular-nums leading-none text-navy-900">
          {displayValue.toLocaleString()}
        </span>

        {showGrowth && (
          <span
            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full
              text-[10px] font-bold ring-1 bg-navy-50 text-navy-700 ring-navy-200 flex-shrink-0 mb-1"
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
        )}
      </div>
    </div>
  );
};

export default StatsCard;
