// src/components/dashboard/StatsCards.tsx
//
// Now built on the shared ui/StatsCard (animated circular count-up, trend
// badge) instead of its own flat static tiles - same visual language as the
// Admin dashboard's stat cards, just fed Member-specific task data. No
// growthPercent/previousValue history is tracked for a Member's own tasks,
// so trend is left "neutral" and growthPercent at 0 rather than inventing a
// number - the shared card renders that as a plain dash badge, not a
// misleading +0%/-0%.

import React from "react";
import type { Task } from "../../types/task.types";
import { isTaskOverdue } from "../../types/task.types";
import StatsCard from "../ui/StatsCard";
import type { GrowthMetric } from "../../types/dashboard.types";

interface StatsCardsProps {
  tasks: Task[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const overdue = tasks.filter((t) =>
    isTaskOverdue(t.dueDate, t.status),
  ).length;

  const metrics: GrowthMetric[] = [
    {
      label: "Total Tasks",
      value: total,
      previousValue: total,
      growthPercent: 0,
      trend: "neutral",
      icon: "list-todo",
      color: "blue",
    },
    {
      label: "Completed",
      value: completed,
      previousValue: completed,
      growthPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
      trend: completed > 0 ? "up" : "neutral",
      icon: "check-square",
      color: "green",
    },
    {
      label: "Pending",
      value: pending,
      previousValue: pending,
      growthPercent: 0,
      trend: "neutral",
      icon: "clock",
      color: "orange",
    },
    {
      label: "Overdue",
      value: overdue,
      previousValue: overdue,
      growthPercent: 0,
      trend: overdue > 0 ? "down" : "neutral",
      icon: "alert-triangle",
      color: "red",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
      {metrics.map((metric, index) => (
        <StatsCard key={metric.label} metric={metric} index={index} />
      ))}
    </div>
  );
};

export default StatsCards;
