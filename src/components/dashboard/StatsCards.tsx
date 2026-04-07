// src/components/dashboard/StatsCards.tsx

import React from "react";
import { CheckCircle, Clock, AlertTriangle, ListTodo } from "lucide-react";
import type { Task } from "../../types/task.types";
import { isTaskOverdue } from "../../types/task.types";

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

  const cards = [
    {
      label: "Total Tasks",
      value: total,
      icon: <ListTodo size={20} />,
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      text: "text-blue-700",
      border: "border-blue-100",
      sub: "All assigned tasks",
    },
    {
      label: "Completed",
      value: completed,
      icon: <CheckCircle size={20} />,
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      text: "text-green-700",
      border: "border-green-100",
      sub: `${total > 0 ? Math.round((completed / total) * 100) : 0}% done`,
    },
    {
      label: "Pending",
      value: pending,
      icon: <Clock size={20} />,
      bg: "bg-yellow-50",
      iconBg: "bg-yellow-100",
      text: "text-yellow-700",
      border: "border-yellow-100",
      sub: "Awaiting action",
    },
    {
      label: "Overdue",
      value: overdue,
      icon: <AlertTriangle size={20} />,
      bg: overdue > 0 ? "bg-red-50" : "bg-gray-50",
      iconBg: overdue > 0 ? "bg-red-100" : "bg-gray-100",
      text: overdue > 0 ? "text-red-700" : "text-gray-500",
      border:
        overdue > 0 ? "border-red-200 ring-1 ring-red-100" : "border-gray-100",
      sub: overdue > 0 ? "Needs attention!" : "All on track",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`${card.bg} ${card.border} border rounded-xl p-5
                      transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`${card.iconBg} ${card.text} p-2.5 rounded-lg`}>
              {card.icon}
            </div>
          </div>
          <div className={`text-3xl font-bold ${card.text} mb-0.5`}>
            {card.value}
          </div>
          <div className="text-sm font-semibold text-gray-700">
            {card.label}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">{card.sub}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
