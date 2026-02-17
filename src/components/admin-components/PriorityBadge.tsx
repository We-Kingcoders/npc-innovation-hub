/**
 * PriorityBadge Component
 * Reusable priority badge
 */

import React from "react";
import { getPriorityColor } from "../../types/task.types";

interface PriorityBadgeProps {
  priority: "low" | "medium" | "high";
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const labels = {
    low: "Low",
    medium: "Medium",
    high: "High",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(priority)}`}
    >
      {labels[priority]}
    </span>
  );
};
