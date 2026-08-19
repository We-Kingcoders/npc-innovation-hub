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

  // Two-tone scheme: white-gray cards with dark-blue accents.
  // The Overdue card inverts to solid dark blue when it needs attention.
  const alert = overdue > 0;

  const cards = [
    {
      label: "Total Tasks",
      value: total,
      icon: <ListTodo size={20} />,
      sub: "All assigned tasks",
      solid: false,
    },
    {
      label: "Completed",
      value: completed,
      icon: <CheckCircle size={20} />,
      sub: `${total > 0 ? Math.round((completed / total) * 100) : 0}% done`,
      solid: false,
    },
    {
      label: "Pending",
      value: pending,
      icon: <Clock size={20} />,
      sub: "Awaiting action",
      solid: false,
    },
    {
      label: "Overdue",
      value: overdue,
      icon: <AlertTriangle size={20} />,
      sub: alert ? "Needs attention!" : "All on track",
      solid: alert,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`border rounded-xl p-5 transition-all duration-200
                      hover:shadow-md hover:-translate-y-0.5
                      ${
                        card.solid
                          ? "bg-navy-800 border-navy-800"
                          : "bg-white border-mist-300"
                      }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div
              className={`p-2.5 rounded-lg ${
                card.solid
                  ? "bg-navy-700 text-white"
                  : "bg-navy-50 text-navy-700"
              }`}
            >
              {card.icon}
            </div>
          </div>
          <div
            className={`text-3xl font-bold mb-0.5 ${
              card.solid ? "text-white" : "text-navy-800"
            }`}
          >
            {card.value}
          </div>
          <div
            className={`text-sm font-semibold ${
              card.solid ? "text-navy-100" : "text-navy-700"
            }`}
          >
            {card.label}
          </div>
          <div
            className={`text-xs mt-0.5 ${
              card.solid ? "text-navy-200" : "text-mist-500"
            }`}
          >
            {card.sub}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
