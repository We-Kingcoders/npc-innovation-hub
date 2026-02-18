// // ============================================================
// // DashboardCharts.tsx
// // Tasks completion line chart + projects growth bar chart
// // ============================================================

// import React, { useMemo } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Area,
//   AreaChart,
// } from "recharts";
// import type {
//   TaskAnalytics,
//   ProjectInsightsData,
// } from "../../../types/dashboard.types";

// interface DashboardChartsProps {
//   taskAnalytics: TaskAnalytics | null;
//   projectInsights: ProjectInsightsData | null;
//   loading: boolean;
// }

// const ChartSkeleton: React.FC = () => (
//   <div className="h-full flex items-end gap-2 px-4 pb-4 animate-pulse">
//     {[40, 70, 55, 80, 60, 90, 75].map((h, i) => (
//       <div
//         key={i}
//         className="flex-1 bg-gray-200 rounded-t-sm"
//         style={{ height: `${h}%` }}
//       />
//     ))}
//   </div>
// );

// const CustomBarTooltip: React.FC<{
//   active?: boolean;
//   payload?: Array<{ value: number }>;
//   label?: string;
// }> = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div className="bg-white px-3 py-2 rounded-xl shadow-lg border border-gray-100 text-sm">
//       <p className="font-semibold text-gray-800">{label}</p>
//       <p className="text-indigo-600">{payload[0].value} projects</p>
//     </div>
//   );
// };

// const CustomLineTooltip: React.FC<{
//   active?: boolean;
//   payload?: Array<{ value: number; name: string }>;
//   label?: string;
// }> = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div className="bg-white px-3 py-2 rounded-xl shadow-lg border border-gray-100 text-sm">
//       <p className="font-semibold text-gray-800 mb-1">{label}</p>
//       {payload.map((p, i) => (
//         <p key={i} className="text-emerald-600">
//           {p.name}: {p.value}
//         </p>
//       ))}
//     </div>
//   );
// };

// // Build monthly aggregated bar data from projects
// function buildProjectMonthlyData(insights: ProjectInsightsData | null) {
//   const months = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];

//   // Generate last 6 months
//   const now = new Date();
//   const result = Array.from({ length: 6 }, (_, i) => {
//     const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
//     return {
//       name: months[d.getMonth()],
//       projects: 0,
//     };
//   });

//   if (!insights) return result;

//   // Count recent projects by month
//   for (const project of insights.recentProjects) {
//     const d = new Date(project.createdAt);
//     const monthLabel = months[d.getMonth()];
//     const entry = result.find((r) => r.name === monthLabel);
//     if (entry) entry.projects++;
//   }

//   return result;
// }

// // Build task completion trend (synthetic trend based on status)
// function buildTaskTrendData(analytics: TaskAnalytics | null) {
//   const months = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
//   if (!analytics) return months.map((m) => ({ name: m, completed: 0 }));

//   const baseCompleted = analytics.byStatus.completed ?? 0;
//   // Distribute backwards with some variation
//   return months.map((m, i) => ({
//     name: m,
//     completed: Math.max(
//       0,
//       Math.round(baseCompleted * ((i + 1) / months.length) + Math.random() * 2),
//     ),
//     inProgress: Math.max(
//       0,
//       Math.round(
//         (analytics.byStatus.in_progress ?? 0) * ((i + 1) / months.length),
//       ),
//     ),
//   }));
// }

// const DashboardCharts: React.FC<DashboardChartsProps> = ({
//   taskAnalytics,
//   projectInsights,
//   loading,
// }) => {
//   const projectChartData = useMemo(
//     () => buildProjectMonthlyData(projectInsights),
//     [projectInsights],
//   );
//   const taskChartData = useMemo(
//     () => buildTaskTrendData(taskAnalytics),
//     [taskAnalytics],
//   );

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
//       {/* Projects Growth Bar Chart */}
//       <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h3 className="font-semibold text-gray-900 text-sm">
//               Project Activity
//             </h3>
//             <p className="text-xs text-gray-400 mt-0.5">
//               {projectInsights?.total ?? 0} total projects
//             </p>
//           </div>
//           {projectInsights && (
//             <span
//               className={`text-xs font-semibold px-2 py-1 rounded-full ${
//                 projectInsights.growthPercent >= 0
//                   ? "bg-emerald-50 text-emerald-700"
//                   : "bg-rose-50 text-rose-700"
//               }`}
//             >
//               {projectInsights.growthPercent >= 0 ? "+" : ""}
//               {projectInsights.growthPercent}% growth
//             </span>
//           )}
//         </div>
//         <div className="h-48">
//           {loading ? (
//             <ChartSkeleton />
//           ) : (
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart
//                 data={projectChartData}
//                 margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
//               >
//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                   vertical={false}
//                   stroke="#f3f4f6"
//                 />
//                 <XAxis
//                   dataKey="name"
//                   tick={{ fill: "#9ca3af", fontSize: 11 }}
//                   tickLine={false}
//                   axisLine={false}
//                 />
//                 <YAxis
//                   tick={{ fill: "#9ca3af", fontSize: 11 }}
//                   tickLine={false}
//                   axisLine={false}
//                   allowDecimals={false}
//                 />
//                 <Tooltip
//                   content={<CustomBarTooltip />}
//                   cursor={{ fill: "#f9fafb" }}
//                 />
//                 <Bar
//                   dataKey="projects"
//                   fill="#6366f1"
//                   radius={[6, 6, 0, 0]}
//                   maxBarSize={40}
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           )}
//         </div>
//       </div>

//       {/* Task Completion Area Chart */}
//       <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h3 className="font-semibold text-gray-900 text-sm">
//               Task Completion Trend
//             </h3>
//             <p className="text-xs text-gray-400 mt-0.5">
//               {taskAnalytics?.completionRate ?? 0}% completion rate
//             </p>
//           </div>
//           <span className="text-xs font-semibold px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">
//             Last 6 months
//           </span>
//         </div>
//         <div className="h-48">
//           {loading ? (
//             <ChartSkeleton />
//           ) : (
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart
//                 data={taskChartData}
//                 margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
//               >
//                 <defs>
//                   <linearGradient
//                     id="completedGrad"
//                     x1="0"
//                     y1="0"
//                     x2="0"
//                     y2="1"
//                   >
//                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
//                     <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
//                   </linearGradient>
//                   <linearGradient
//                     id="inProgressGrad"
//                     x1="0"
//                     y1="0"
//                     x2="0"
//                     y2="1"
//                   >
//                     <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
//                     <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                   vertical={false}
//                   stroke="#f3f4f6"
//                 />
//                 <XAxis
//                   dataKey="name"
//                   tick={{ fill: "#9ca3af", fontSize: 11 }}
//                   tickLine={false}
//                   axisLine={false}
//                 />
//                 <YAxis
//                   tick={{ fill: "#9ca3af", fontSize: 11 }}
//                   tickLine={false}
//                   axisLine={false}
//                   allowDecimals={false}
//                 />
//                 <Tooltip content={<CustomLineTooltip />} />
//                 <Area
//                   type="monotone"
//                   dataKey="completed"
//                   name="Completed"
//                   stroke="#10b981"
//                   strokeWidth={2}
//                   fill="url(#completedGrad)"
//                   dot={false}
//                   activeDot={{ r: 4, fill: "#10b981" }}
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="inProgress"
//                   name="In Progress"
//                   stroke="#6366f1"
//                   strokeWidth={2}
//                   fill="url(#inProgressGrad)"
//                   dot={false}
//                   activeDot={{ r: 4, fill: "#6366f1" }}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardCharts;

// ============================================================
// DashboardCharts.tsx
// Project activity bar chart + real task completion area chart
// ============================================================

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import type { ProjectInsightsData } from "../../../types/dashboard.types";
import type { TaskTrendPoint } from "../../../hooks/useAdminDashboard";

interface DashboardChartsProps {
  taskTrend: TaskTrendPoint[];
  projectInsights: ProjectInsightsData | null;
  loading: boolean;
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

const ChartSkeleton: React.FC = () => (
  <div className="h-full flex items-end gap-2 px-4 pb-4 animate-pulse">
    {[40, 70, 55, 80, 60, 90, 75].map((h, i) => (
      <div
        key={i}
        className="flex-1 bg-gray-200 rounded-t-sm"
        style={{ height: `${h}%` }}
      />
    ))}
  </div>
);

// ─── Custom Tooltips ──────────────────────────────────────────────────────────

const BarTooltip: React.FC<{
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white px-3 py-2 rounded-xl shadow-lg border border-gray-100 text-sm">
      <p className="font-semibold text-gray-800">{label}</p>
      <p className="text-indigo-600 mt-0.5">{payload[0].value} projects</p>
    </div>
  );
};

const TrendTooltip: React.FC<{
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const nameMap: Record<string, string> = {
    completed: "Completed",
    inProgress: "In Progress",
    pending: "Pending",
  };
  return (
    <div className="bg-white px-3 py-2 rounded-xl shadow-lg border border-gray-100 text-sm min-w-[130px]">
      <p className="font-semibold text-gray-800 mb-1">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <span style={{ color: p.color }} className="text-xs">
            {nameMap[p.name] ?? p.name}
          </span>
          <span className="text-xs font-semibold text-gray-700">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Project monthly aggregator ───────────────────────────────────────────────

function buildProjectMonthlyData(insights: ProjectInsightsData | null) {
  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const now = new Date();

  const result = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      name: MONTHS[d.getMonth()],
      year: d.getFullYear(),
      month: d.getMonth(),
      projects: 0,
    };
  });

  if (!insights) return result;

  for (const project of insights.recentProjects) {
    const d = new Date(project.createdAt);
    const slot = result.find(
      (r) => r.year === d.getFullYear() && r.month === d.getMonth(),
    );
    if (slot) slot.projects++;
  }

  return result;
}

// ─── Component ────────────────────────────────────────────────────────────────

const DashboardCharts: React.FC<DashboardChartsProps> = ({
  taskTrend,
  projectInsights,
  loading,
}) => {
  const projectChartData = useMemo(
    () => buildProjectMonthlyData(projectInsights),
    [projectInsights],
  );

  // Determine if there is any real task trend data
  const hasTrendData = taskTrend.some(
    (t) => t.completed > 0 || t.inProgress > 0 || t.pending > 0,
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      {/* ── Project Activity Bar Chart ── */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">
              Project Activity
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {projectInsights?.total ?? 0} total projects
            </p>
          </div>
          {projectInsights && (
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                projectInsights.growthPercent >= 0
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
              }`}
            >
              {projectInsights.growthPercent >= 0 ? "+" : ""}
              {projectInsights.growthPercent}% growth
            </span>
          )}
        </div>
        <div className="h-48">
          {loading ? (
            <ChartSkeleton />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={projectChartData}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<BarTooltip />}
                  cursor={{ fill: "#f9fafb" }}
                />
                <Bar
                  dataKey="projects"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Task Completion Trend Area Chart (real data) ── */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">
              Task Completion Trend
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Real task data — last 6 months
            </p>
          </div>
          {/* Legend pills */}
          <div className="flex items-center gap-2">
            {[
              { key: "completed", label: "Done", color: "#10b981" },
              { key: "inProgress", label: "In Progress", color: "#6366f1" },
              { key: "pending", label: "Pending", color: "#f59e0b" },
            ].map((item) => (
              <span
                key={item.key}
                className="hidden sm:inline-flex items-center gap-1 text-xs text-gray-500"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
              </span>
            ))}
          </div>
        </div>

        <div className="h-48">
          {loading ? (
            <ChartSkeleton />
          ) : !hasTrendData ? (
            <div className="h-full flex flex-col items-center justify-center gap-2">
              <svg
                className="w-8 h-8 text-gray-300"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-400 text-xs">
                No task activity in the last 6 months
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={taskTrend}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="gradCompleted"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="gradInProgress"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<TrendTooltip />} />
                <Area
                  type="monotone"
                  dataKey="completed"
                  name="completed"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#gradCompleted)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#10b981" }}
                />
                <Area
                  type="monotone"
                  dataKey="inProgress"
                  name="inProgress"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#gradInProgress)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#6366f1" }}
                />
                <Area
                  type="monotone"
                  dataKey="pending"
                  name="pending"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="url(#gradPending)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#f59e0b" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
