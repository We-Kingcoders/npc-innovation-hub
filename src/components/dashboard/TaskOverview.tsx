// src/components/dashboard/TaskOverview.tsx

import React from "react";
import type { Task } from "../../types/task.types";
import { isTaskOverdue } from "../../types/task.types";

interface TaskOverviewProps {
  tasks: Task[];
}

const TaskOverview: React.FC<TaskOverviewProps> = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const inProg = tasks.filter((t) => t.status === "in-progress").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const overdue = tasks.filter((t) =>
    isTaskOverdue(t.dueDate, t.status),
  ).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  // SVG donut
  const radius = 42;
  const circ = 2 * Math.PI * radius;
  const filled = (pct / 100) * circ;
  const gap = circ - filled;

  const segments = [
    { label: "Completed", count: completed, color: "#22c55e" },
    { label: "In Progress", count: inProg, color: "#6366f1" },
    { label: "Pending", count: pending, color: "#eab308" },
    { label: "Overdue", count: overdue, color: "#ef4444" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h3 className="text-sm font-bold text-gray-800 mb-4">Task Overview</h3>

      {total === 0 ? (
        <p className="text-xs text-gray-400 text-center py-4">No tasks yet</p>
      ) : (
        <>
          {/* Donut SVG */}
          <div className="flex items-center justify-center mb-5">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="12"
                  strokeDasharray={`${filled} ${gap}`}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{pct}%</span>
                <span className="text-[10px] text-gray-400 font-medium">
                  done
                </span>
              </div>
            </div>
          </div>

          {/* Segmented bar */}
          <div className="w-full h-2.5 rounded-full overflow-hidden flex mb-4 bg-gray-100">
            {segments.map((s) =>
              s.count > 0 ? (
                <div
                  key={s.label}
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${(s.count / total) * 100}%`,
                    backgroundColor: s.color,
                  }}
                />
              ) : null,
            )}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-y-2">
            {segments.map((s) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-xs text-gray-500">
                  {s.label} <strong className="text-gray-700">{s.count}</strong>
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TaskOverview;
