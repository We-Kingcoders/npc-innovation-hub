/**
 * StatusBadge Component
 * Reusable status badge
 */

import React from "react";
import { getStatusColor } from "../../types/task.types";

interface StatusBadgeProps {
  status: "pending" | "in-progress" | "completed";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const labels = {
    pending: "Pending",
    "in-progress": "In Progress",
    completed: "Completed",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}
    >
      {labels[status]}
    </span>
  );
};
