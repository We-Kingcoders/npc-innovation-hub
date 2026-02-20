// src/components/chat/DateSeparator.tsx

import React from "react";

interface DateSeparatorProps {
  label: string;
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ label }) => (
  <div className="flex items-center gap-3 my-4 px-2">
    <div className="flex-1 h-px bg-gray-200" />
    <span className="text-xs font-medium text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-200 whitespace-nowrap">
      {label}
    </span>
    <div className="flex-1 h-px bg-gray-200" />
  </div>
);

export default DateSeparator;
