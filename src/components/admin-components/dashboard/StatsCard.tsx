// // ============================================================
// // StatsCard.tsx
// // Reusable KPI card with animated count-up and glassmorphism
// // ============================================================

// import React, { useEffect, useRef, useState } from "react";
// import type { GrowthMetric } from "../../../types/dashboard.types";

// // ─── useCountUp hook ──────────────────────────────────────────────────────────
// // Animates a number from 0 → target over `duration` ms
// // Uses requestAnimationFrame with an easeOutQuart curve for a snappy feel

// function useCountUp(target: number, duration = 1400): number {
//   const [display, setDisplay] = useState(0);
//   const rafRef = useRef<number | null>(null);
//   const startTimeRef = useRef<number | null>(null);

//   useEffect(() => {
//     if (target === 0) {
//       setDisplay(0);
//       return;
//     }

//     // Cancel any in-progress animation
//     if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
//     startTimeRef.current = null;

//     const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

//     const animate = (timestamp: number) => {
//       if (startTimeRef.current === null) startTimeRef.current = timestamp;
//       const elapsed = timestamp - startTimeRef.current;
//       const progress = Math.min(elapsed / duration, 1);
//       const eased = easeOutQuart(progress);

//       setDisplay(Math.round(eased * target));

//       if (progress < 1) {
//         rafRef.current = requestAnimationFrame(animate);
//       } else {
//         setDisplay(target); // land exactly on target
//       }
//     };

//     rafRef.current = requestAnimationFrame(animate);

//     return () => {
//       if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
//     };
//   }, [target, duration]);

//   return display;
// }

// // ─── Color map ────────────────────────────────────────────────────────────────

// interface StatsCardProps {
//   metric: GrowthMetric;
//   loading?: boolean;
// }

// const COLOR_MAP: Record<
//   GrowthMetric["color"],
//   { bg: string; icon: string; glow: string; border: string }
// > = {
//   blue: {
//     bg: "from-blue-500/10 to-blue-600/5",
//     icon: "bg-blue-500/15 text-blue-600",
//     glow: "shadow-blue-100",
//     border: "border-blue-100",
//   },
//   green: {
//     bg: "from-emerald-500/10 to-emerald-600/5",
//     icon: "bg-emerald-500/15 text-emerald-600",
//     glow: "shadow-emerald-100",
//     border: "border-emerald-100",
//   },
//   purple: {
//     bg: "from-violet-500/10 to-violet-600/5",
//     icon: "bg-violet-500/15 text-violet-600",
//     glow: "shadow-violet-100",
//     border: "border-violet-100",
//   },
//   orange: {
//     bg: "from-orange-500/10 to-orange-600/5",
//     icon: "bg-orange-500/15 text-orange-600",
//     glow: "shadow-orange-100",
//     border: "border-orange-100",
//   },
//   red: {
//     bg: "from-rose-500/10 to-rose-600/5",
//     icon: "bg-rose-500/15 text-rose-600",
//     glow: "shadow-rose-100",
//     border: "border-rose-100",
//   },
//   indigo: {
//     bg: "from-indigo-500/10 to-indigo-600/5",
//     icon: "bg-indigo-500/15 text-indigo-600",
//     glow: "shadow-indigo-100",
//     border: "border-indigo-100",
//   },
//   teal: {
//     bg: "from-teal-500/10 to-teal-600/5",
//     icon: "bg-teal-500/15 text-teal-600",
//     glow: "shadow-teal-100",
//     border: "border-teal-100",
//   },
// };

// const ICON_PATHS: Record<string, React.ReactNode> = {
//   users: (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth={2}
//       className="w-5 h-5"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
//       />
//       <circle cx="9" cy="7" r="4" />
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M23 21v-2a4 4 0 0 0-3-3.87"
//       />
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M16 3.13a4 4 0 0 1 0 7.75"
//       />
//     </svg>
//   ),
//   folder: (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth={2}
//       className="w-5 h-5"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
//       />
//     </svg>
//   ),
//   book: (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth={2}
//       className="w-5 h-5"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M4 19.5A2.5 2.5 0 016.5 17H20"
//       />
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
//       />
//     </svg>
//   ),
//   edit: (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth={2}
//       className="w-5 h-5"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
//       />
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
//       />
//     </svg>
//   ),
//   briefcase: (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth={2}
//       className="w-5 h-5"
//     >
//       <rect x="2" y="7" width="20" height="14" rx="2" />
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
//       />
//     </svg>
//   ),
//   "check-square": (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth={2}
//       className="w-5 h-5"
//     >
//       <polyline points="9 11 12 14 22 4" />
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
//       />
//     </svg>
//   ),
//   calendar: (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth={2}
//       className="w-5 h-5"
//     >
//       <rect x="3" y="4" width="18" height="18" rx="2" />
//       <line x1="16" y1="2" x2="16" y2="6" />
//       <line x1="8" y1="2" x2="8" y2="6" />
//       <line x1="3" y1="10" x2="21" y2="10" />
//     </svg>
//   ),
// };

// // ─── Skeleton ─────────────────────────────────────────────────────────────────

// export const StatsCardSkeleton: React.FC = () => (
//   <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm animate-pulse">
//     <div className="flex items-start justify-between mb-4">
//       <div className="w-10 h-10 bg-gray-200 rounded-xl" />
//       <div className="w-14 h-5 bg-gray-200 rounded-full" />
//     </div>
//     <div className="w-16 h-8 bg-gray-200 rounded-lg mb-1" />
//     <div className="w-24 h-4 bg-gray-100 rounded" />
//   </div>
// );

// // ─── Card ─────────────────────────────────────────────────────────────────────

// const StatsCard: React.FC<StatsCardProps> = ({ metric, loading }) => {
//   // Animated display value: starts at 0, counts up to metric.value
//   const displayValue = useCountUp(
//     loading ? 0 : typeof metric.value === "number" ? metric.value : 0,
//   );

//   if (loading) return <StatsCardSkeleton />;

//   const colors = COLOR_MAP[metric.color];
//   const isPositive = metric.trend === "up";
//   const isNegative = metric.trend === "down";

//   return (
//     <div
//       className={`
//         group relative bg-white rounded-2xl p-5 border ${colors.border}
//         shadow-sm hover:shadow-lg ${colors.glow}
//         transition-all duration-300 hover:-translate-y-0.5
//         overflow-hidden cursor-default
//       `}
//     >
//       {/* Background gradient */}
//       <div
//         className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-60 pointer-events-none`}
//       />
//       {/* Corner accent */}
//       <div
//         className={`absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br ${colors.bg} rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-300`}
//       />

//       <div className="relative z-10">
//         {/* Icon + Growth badge */}
//         <div className="flex items-start justify-between mb-4">
//           <div className={`p-2.5 rounded-xl ${colors.icon}`}>
//             {ICON_PATHS[metric.icon ?? "folder"]}
//           </div>

//           <span
//             className={`
//               inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ring-1
//               ${
//                 isPositive
//                   ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
//                   : isNegative
//                     ? "bg-rose-50 text-rose-700 ring-rose-200"
//                     : "bg-gray-50 text-gray-500 ring-gray-200"
//               }
//             `}
//           >
//             {isPositive ? (
//               <svg
//                 className="w-2.5 h-2.5"
//                 fill="currentColor"
//                 viewBox="0 0 10 10"
//               >
//                 <path d="M5 2l4 6H1z" />
//               </svg>
//             ) : isNegative ? (
//               <svg
//                 className="w-2.5 h-2.5"
//                 fill="currentColor"
//                 viewBox="0 0 10 10"
//               >
//                 <path d="M5 8L1 2h8z" />
//               </svg>
//             ) : (
//               <span className="w-2.5 h-0.5 bg-current rounded" />
//             )}
//             {metric.growthPercent > 0 ? "+" : ""}
//             {metric.growthPercent}%
//           </span>
//         </div>

//         {/* Animated count-up value */}
//         <div className="mb-1">
//           <span className="text-3xl font-bold text-gray-900 tracking-tight tabular-nums">
//             {displayValue.toLocaleString()}
//           </span>
//           {metric.unit && (
//             <span className="ml-1 text-sm text-gray-400">{metric.unit}</span>
//           )}
//         </div>

//         {/* Label */}
//         <p className="text-sm text-gray-500 font-medium">{metric.label}</p>
//       </div>
//     </div>
//   );
// };

// export default StatsCard;

// ============================================================
// StatsCard.tsx
// KPI card — animated count-up + colored circular number bg
// ============================================================

import React, { useEffect, useRef, useState } from "react";
import type { GrowthMetric } from "../../../types/dashboard.types";

// ─── useCountUp ───────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1400): number {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (target === 0) {
      setDisplay(0);
      return;
    }
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    startTimeRef.current = null;

    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      setDisplay(Math.round(easeOutQuart(progress) * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplay(target);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return display;
}

// ─── Color map ────────────────────────────────────────────────────────────────

interface StatsCardProps {
  metric: GrowthMetric;
  loading?: boolean;
}

const COLOR_MAP: Record<
  GrowthMetric["color"],
  {
    cardBg: string; // gradient on card background
    border: string;
    glow: string;
    icon: string; // icon pill bg + text
    numBg: string; // full circle behind count number
    numText: string; // number text color inside circle
    cornerAccent: string;
  }
> = {
  blue: {
    cardBg: "from-blue-50/80 to-white",
    border: "border-blue-100",
    glow: "hover:shadow-blue-100",
    icon: "bg-blue-100 text-blue-600",
    numBg: "bg-blue-500",
    numText: "text-white",
    cornerAccent: "bg-blue-100",
  },
  green: {
    cardBg: "from-emerald-50/80 to-white",
    border: "border-emerald-100",
    glow: "hover:shadow-emerald-100",
    icon: "bg-emerald-100 text-emerald-600",
    numBg: "bg-emerald-500",
    numText: "text-white",
    cornerAccent: "bg-emerald-100",
  },
  purple: {
    cardBg: "from-violet-50/80 to-white",
    border: "border-violet-100",
    glow: "hover:shadow-violet-100",
    icon: "bg-violet-100 text-violet-600",
    numBg: "bg-violet-500",
    numText: "text-white",
    cornerAccent: "bg-violet-100",
  },
  orange: {
    cardBg: "from-orange-50/80 to-white",
    border: "border-orange-100",
    glow: "hover:shadow-orange-100",
    icon: "bg-orange-100 text-orange-600",
    numBg: "bg-orange-500",
    numText: "text-white",
    cornerAccent: "bg-orange-100",
  },
  red: {
    cardBg: "from-rose-50/80 to-white",
    border: "border-rose-100",
    glow: "hover:shadow-rose-100",
    icon: "bg-rose-100 text-rose-600",
    numBg: "bg-rose-500",
    numText: "text-white",
    cornerAccent: "bg-rose-100",
  },
  indigo: {
    cardBg: "from-indigo-50/80 to-white",
    border: "border-indigo-100",
    glow: "hover:shadow-indigo-100",
    icon: "bg-indigo-100 text-indigo-600",
    numBg: "bg-indigo-500",
    numText: "text-white",
    cornerAccent: "bg-indigo-100",
  },
  teal: {
    cardBg: "from-teal-50/80 to-white",
    border: "border-teal-100",
    glow: "hover:shadow-teal-100",
    icon: "bg-teal-100 text-teal-600",
    numBg: "bg-teal-500",
    numText: "text-white",
    cornerAccent: "bg-teal-100",
  },
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
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export const StatsCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="w-8 h-8 bg-gray-200 rounded-lg" />
      <div className="w-12 h-5 bg-gray-200 rounded-full" />
    </div>
    {/* Circular number skeleton */}
    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3" />
    <div className="w-20 h-3 bg-gray-100 rounded mx-auto" />
  </div>
);

// ─── Card ─────────────────────────────────────────────────────────────────────

const StatsCard: React.FC<StatsCardProps> = ({ metric, loading }) => {
  const displayValue = useCountUp(
    loading || typeof metric.value !== "number" ? 0 : metric.value,
  );

  if (loading) return <StatsCardSkeleton />;

  const c = COLOR_MAP[metric.color];
  const isPositive = metric.trend === "up";
  const isNegative = metric.trend === "down";

  return (
    <div
      className={`
        group relative bg-gradient-to-b ${c.cardBg}
        rounded-2xl p-5 border ${c.border}
        shadow-sm hover:shadow-lg ${c.glow}
        transition-all duration-300 hover:-translate-y-0.5
        overflow-hidden cursor-default
      `}
    >
      {/* Decorative corner circle */}
      <div
        className={`absolute -top-6 -right-6 w-20 h-20 rounded-full ${c.cornerAccent}
          opacity-40 group-hover:opacity-70 transition-opacity duration-300`}
      />

      <div className="relative z-10 flex flex-col items-center text-center gap-3">
        {/* Top row: icon (left) + growth badge (right) */}
        <div className="w-full flex items-center justify-between">
          <div className={`p-2 rounded-lg ${c.icon}`}>
            {ICON_PATHS[metric.icon ?? "folder"]}
          </div>

          {/* Growth badge */}
          <span
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full
              text-[10px] font-bold ring-1
              ${
                isPositive
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                  : isNegative
                    ? "bg-rose-50 text-rose-700 ring-rose-200"
                    : "bg-gray-50 text-gray-500 ring-gray-200"
              }`}
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
        <p className="text-xs font-semibold text-gray-600 leading-tight">
          {metric.label}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;
