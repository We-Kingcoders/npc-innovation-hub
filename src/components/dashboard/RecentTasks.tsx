// src/components/dashboard/RecentTasks.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, AlertCircle, Calendar } from "lucide-react";
import type { Task } from "../../types/task.types";
import { isTaskOverdue, getDaysUntilDue } from "../../types/task.types";

interface RecentTasksProps {
  tasks: Task[];
  loading: boolean;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

// Dashboard-local badge styles — dark blue on white-gray, no third hue.
// (The shared helpers in task.types stay colourful for the other pages.)
const statusBadge = (status: string): string => {
  switch (status) {
    case "completed":
      return "bg-navy-800 text-white border-navy-800";
    case "in-progress":
      return "bg-navy-100 text-navy-800 border-navy-200";
    default:
      return "bg-mist-200 text-mist-600 border-mist-300";
  }
};

const priorityBadge = (priority: string): string => {
  switch (priority) {
    case "high":
      return "bg-navy-700 text-white border-navy-700";
    case "medium":
      return "bg-navy-50 text-navy-700 border-navy-200";
    default:
      return "bg-mist-100 text-mist-600 border-mist-300";
  }
};

const priorityDot = (priority: string): string => {
  switch (priority) {
    case "high":
      return "bg-navy-800";
    case "medium":
      return "bg-navy-400";
    default:
      return "bg-mist-400";
  }
};

const RecentTasks: React.FC<RecentTasksProps> = ({ tasks, loading }) => {
  const navigate = useNavigate();
  const displayed = tasks.slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-mist-300 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-bold text-navy-800">Recent Tasks</h3>
        <button
          onClick={() => navigate("/dashboard/tasks")}
          className="flex items-center gap-1 text-xs text-navy-600
                     hover:text-navy-800 font-semibold transition-colors"
        >
          View all <ArrowRight size={13} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 bg-mist-300 rounded-lg shrink-0" />
              <div className="flex-1">
                <div className="h-3.5 bg-mist-300 rounded w-3/4 mb-2" />
                <div className="h-3 bg-mist-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <p className="text-sm text-mist-500 text-center py-6">
          No tasks assigned yet.
        </p>
      ) : (
        <div className="space-y-3">
          {displayed.map((task) => {
            const overdue = isTaskOverdue(task.dueDate, task.status);
            return (
              <div
                key={task.id}
                onClick={() => navigate(`/dashboard/tasks/${task.id}`)}
                className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer
                            transition-all duration-200 hover:shadow-sm
                            ${
                              overdue
                                ? "bg-navy-50 border border-navy-300"
                                : "hover:bg-mist-100 border border-transparent"
                            }`}
              >
                {/* Priority dot */}
                <div
                  className={`w-2 h-2 rounded-full mt-2 shrink-0 ${priorityDot(
                    task.priority,
                  )}`}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-navy-800 line-clamp-1">
                      {task.title}
                    </p>
                    {overdue && (
                      <AlertCircle
                        size={13}
                        className="text-navy-800 shrink-0 mt-0.5"
                      />
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border
                                      ${statusBadge(task.status)}`}
                    >
                      {task.status === "in-progress"
                        ? "In Progress"
                        : task.status.charAt(0).toUpperCase() +
                          task.status.slice(1)}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border
                                      ${priorityBadge(task.priority)}`}
                    >
                      {task.priority.charAt(0).toUpperCase() +
                        task.priority.slice(1)}
                    </span>
                    <span
                      className={`flex items-center gap-0.5 text-[10px] font-medium
                                      ${overdue ? "text-navy-800 font-semibold" : "text-mist-500"}`}
                    >
                      <Calendar size={10} />
                      {formatDate(task.dueDate)} ·{" "}
                      {getDaysUntilDue(task.dueDate)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentTasks;
