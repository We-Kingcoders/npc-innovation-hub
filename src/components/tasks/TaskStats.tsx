// src/components/tasks/TaskStats.tsx

import React from "react";
import { CheckCircle, Clock, Loader, ListTodo } from "lucide-react";
import type { Task } from "../../types/task.types";

interface TaskStatsProps {
  tasks: Task[];
}

const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const pending = tasks.filter((t) => t.status === "pending").length;

  const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    {
      label: "Total",
      value: total,
      icon: <ListTodo size={20} />,
      bg: "bg-navy-50",
      iconBg: "bg-navy-100",
      text: "text-navy-700",
      border: "border-navy-100",
    },
    {
      label: "Pending",
      value: pending,
      icon: <Clock size={20} />,
      bg: "bg-yellow-50",
      iconBg: "bg-yellow-100",
      text: "text-yellow-700",
      border: "border-yellow-100",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: <Loader size={20} />,
      bg: "bg-mist-100",
      iconBg: "bg-mist-200",
      text: "text-navy-800",
      border: "border-mist-200",
    },
    {
      label: "Completed",
      value: completed,
      icon: <CheckCircle size={20} />,
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      text: "text-green-700",
      border: "border-green-100",
    },
  ];

  return (
    <div className="mb-6 flex flex-col gap-4">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`${s.bg} ${s.border} border rounded-xl p-4 flex items-center gap-3`}
          >
            <div className={`${s.iconBg} ${s.text} p-2.5 rounded-lg`}>
              {s.icon}
            </div>
            <div>
              <div className={`text-2xl font-bold ${s.text}`}>{s.value}</div>
              <div className="text-xs text-mist-500 font-medium">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="bg-white border border-mist-300 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-navy-800">
            Overall Progress
          </span>
          <span className="text-sm font-bold text-green-600">
            {completionPct}% completed
          </span>
        </div>
        <div className="w-full bg-mist-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
            style={{ width: `${completionPct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-mist-400 mt-1.5">
          <span>{completed} done</span>
          <span>{total - completed} remaining</span>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;
