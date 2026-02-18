// // ============================================================
// // AdminDashboard.tsx  ← REPLACES src/pages/Admin-pages/AdminDashboard.tsx
// // Modern SaaS-grade analytics command center
// // ============================================================

// import React, { useCallback } from "react";
// import Sidebar from "../../components/admin-components/Sidebar";
// import Topbar from "../../components/admin-components/Topbar";

// // New dashboard components
// import ModernStatsCards from "../../components/admin-components/dashboard/ModernStatsCards";
// import DashboardCharts from "../../components/admin-components/dashboard/DashboardCharts";
// import TaskOverviewWidget from "../../components/admin-components/dashboard/TaskOverviewWidget";
// import EventInsightsWidget from "../../components/admin-components/dashboard/EventInsightsWidget";
// import ActivityFeed from "../../components/admin-components/dashboard/ActivityFeed";
// import QuickActions from "../../components/admin-components/dashboard/QuickActions";
// import SystemHealth from "../../components/admin-components/dashboard/SystemHealth";

// // Hook
// import { useAdminDashboard } from "../../hooks/useAdminDashboard";

// // ─── Error Banner ──────────────────────────────────────────────────────────────
// const ErrorBanner: React.FC<{ errors: Record<string, string> }> = ({
//   errors,
// }) => {
//   const errorList = Object.entries(errors);
//   if (!errorList.length) return null;

//   return (
//     <div className="mb-4 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
//       <svg
//         className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth={2}
//         viewBox="0 0 24 24"
//       >
//         <circle cx="12" cy="12" r="10" />
//         <line x1="12" y1="8" x2="12" y2="12" />
//         <line x1="12" y1="16" x2="12.01" y2="16" />
//       </svg>
//       <div>
//         <p className="text-xs font-semibold text-rose-800">
//           Some data could not be loaded:
//         </p>
//         <ul className="mt-1 space-y-0.5">
//           {errorList.map(([key, msg]) => (
//             <li key={key} className="text-xs text-rose-600">
//               <span className="font-medium capitalize">{key}:</span> {msg}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// // ─── Last Updated Badge ────────────────────────────────────────────────────────
// const LastUpdatedBadge: React.FC<{
//   lastUpdated: Date | null;
//   refreshing: boolean;
//   onRefresh: () => void;
// }> = ({ lastUpdated, refreshing, onRefresh }) => (
//   <div className="flex items-center gap-3">
//     {lastUpdated && (
//       <span className="text-xs text-gray-400">
//         Updated{" "}
//         {lastUpdated.toLocaleTimeString("en-US", {
//           hour: "2-digit",
//           minute: "2-digit",
//         })}
//       </span>
//     )}
//     <button
//       onClick={onRefresh}
//       disabled={refreshing}
//       className={`
//         inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg
//         border border-gray-200 text-gray-600 hover:bg-gray-50
//         transition-all duration-200
//         ${refreshing ? "opacity-50 cursor-not-allowed" : "hover:border-gray-300"}
//       `}
//     >
//       <svg
//         className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
//         fill="none"
//         stroke="currentColor"
//         strokeWidth={2}
//         viewBox="0 0 24 24"
//       >
//         <polyline points="23 4 23 10 17 10" />
//         <polyline points="1 20 1 14 7 14" />
//         <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
//       </svg>
//       {refreshing ? "Refreshing…" : "Refresh"}
//     </button>
//   </div>
// );

// // ─── Main Dashboard ────────────────────────────────────────────────────────────
// export default function AdminDashboard() {
//   const {
//     growthMetrics,
//     taskAnalytics,
//     eventInsights,
//     projectInsights,
//     recentActivity,
//     systemHealth,
//     loading,
//     refreshing,
//     errors,
//     lastUpdated,
//     refresh,
//   } = useAdminDashboard();

//   const handleRefresh = useCallback(() => {
//     refresh();
//   }, [refresh]);

//   return (
//     <div className="flex min-h-screen bg-[#f7f8fa]">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content */}
//       <main className="flex-1 min-w-0 flex flex-col">
//         <Topbar />

//         {/* Page Content */}
//         <div className="flex-1 px-6 xl:px-8 py-6 overflow-auto">
//           {/* Page Header */}
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
//                 Dashboard
//               </h1>
//               <p className="text-sm text-gray-500 mt-0.5">
//                 Innovation Hub — Analytics Command Center
//               </p>
//             </div>
//             <LastUpdatedBadge
//               lastUpdated={lastUpdated}
//               refreshing={refreshing}
//               onRefresh={handleRefresh}
//             />
//           </div>

//           {/* Error Banner */}
//           <ErrorBanner errors={errors} />

//           {/* ── KPI Cards Row ── */}
//           <ModernStatsCards metrics={growthMetrics} loading={loading} />

//           {/* ── Charts Row ── */}
//           <DashboardCharts
//             taskAnalytics={taskAnalytics}
//             projectInsights={projectInsights}
//             loading={loading}
//           />

//           {/* ── Middle Section: 3-column grid ── */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
//             {/* Task Overview (Donut) */}
//             <TaskOverviewWidget analytics={taskAnalytics} loading={loading} />

//             {/* Event Insights */}
//             <EventInsightsWidget insights={eventInsights} loading={loading} />

//             {/* Activity Feed */}
//             <ActivityFeed activities={recentActivity} loading={loading} />
//           </div>

//           {/* ── Bottom Section: 2-column grid ── */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//             {/* Quick Actions */}
//             <QuickActions />

//             {/* System Health */}
//             <SystemHealth
//               health={systemHealth}
//               loading={loading}
//               onRefresh={handleRefresh}
//             />
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// ============================================================
// AdminDashboard.tsx  ← REPLACES src/pages/Admin-pages/AdminDashboard.tsx
// Modern SaaS-grade analytics command center
// ============================================================

import React, { useCallback } from "react";
import Sidebar from "../../components/admin-components/Sidebar";
import Topbar from "../../components/admin-components/Topbar";

// New dashboard components
import ModernStatsCards from "../../components/admin-components/dashboard/ModernStatsCards";
import DashboardCharts from "../../components/admin-components/dashboard/DashboardCharts";
import TaskOverviewWidget from "../../components/admin-components/dashboard/TaskOverviewWidget";
import EventInsightsWidget from "../../components/admin-components/dashboard/EventInsightsWidget";
import ActivityFeed from "../../components/admin-components/dashboard/ActivityFeed";
import QuickActions from "../../components/admin-components/dashboard/QuickActions";
import SystemHealth from "../../components/admin-components/dashboard/SystemHealth";

// Hook
import { useAdminDashboard } from "../../hooks/useAdminDashboard";

// ─── Error Banner ──────────────────────────────────────────────────────────────
const ErrorBanner: React.FC<{ errors: Record<string, string> }> = ({
  errors,
}) => {
  const errorList = Object.entries(errors);
  if (!errorList.length) return null;

  return (
    <div className="mb-4 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
      <svg
        className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <div>
        <p className="text-xs font-semibold text-rose-800">
          Some data could not be loaded:
        </p>
        <ul className="mt-1 space-y-0.5">
          {errorList.map(([key, msg]) => (
            <li key={key} className="text-xs text-rose-600">
              <span className="font-medium capitalize">{key}:</span> {msg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// ─── Last Updated Badge ────────────────────────────────────────────────────────
const LastUpdatedBadge: React.FC<{
  lastUpdated: Date | null;
  refreshing: boolean;
  onRefresh: () => void;
}> = ({ lastUpdated, refreshing, onRefresh }) => (
  <div className="flex items-center gap-3">
    {lastUpdated && (
      <span className="text-xs text-gray-400">
        Updated{" "}
        {lastUpdated.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    )}
    <button
      onClick={onRefresh}
      disabled={refreshing}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg
        border border-gray-200 text-gray-600 hover:bg-gray-50
        transition-all duration-200
        ${refreshing ? "opacity-50 cursor-not-allowed" : "hover:border-gray-300"}
      `}
    >
      <svg
        className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
      </svg>
      {refreshing ? "Refreshing…" : "Refresh"}
    </button>
  </div>
);

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const {
    growthMetrics,
    taskAnalytics,
    taskTrend,
    eventInsights,
    projectInsights,
    recentActivity,
    systemHealth,
    loading,
    refreshing,
    errors,
    lastUpdated,
    refresh,
  } = useAdminDashboard();

  const handleRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="flex min-h-screen bg-[#f7f8fa]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        <Topbar />

        {/* Page Content */}
        <div className="flex-1 px-6 xl:px-8 py-6 overflow-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Innovation Hub — Analytics Command Center
              </p>
            </div>
            <LastUpdatedBadge
              lastUpdated={lastUpdated}
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          </div>

          {/* Error Banner */}
          <ErrorBanner errors={errors} />

          {/* ── KPI Cards Row ── */}
          <ModernStatsCards metrics={growthMetrics} loading={loading} />

          {/* ── Charts Row ── */}
          <DashboardCharts
            taskTrend={taskTrend}
            projectInsights={projectInsights}
            loading={loading}
          />

          {/* ── Middle Section: 3-column grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {/* Task Overview (Donut) */}
            <TaskOverviewWidget analytics={taskAnalytics} loading={loading} />

            {/* Event Insights */}
            <EventInsightsWidget insights={eventInsights} loading={loading} />

            {/* Activity Feed */}
            <ActivityFeed activities={recentActivity} loading={loading} />
          </div>

          {/* ── Bottom Section: 2-column grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Quick Actions */}
            <QuickActions />

            {/* System Health */}
            <SystemHealth
              health={systemHealth}
              loading={loading}
              onRefresh={handleRefresh}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
