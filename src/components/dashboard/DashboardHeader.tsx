// src/components/dashboard/DashboardHeader.tsx

import React, { useMemo } from "react";
import { Sun, Sunset, Moon } from "lucide-react";
import type { User } from "../../types/user.types";

interface DashboardHeaderProps {
  user: User | null;
}

const getGreeting = (): { text: string; icon: React.ReactNode } => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12)
    return {
      text: "Good morning",
      icon: <Sun size={22} className="text-navy-600" />,
    };
  if (hour >= 12 && hour < 18)
    return {
      text: "Good afternoon",
      icon: <Sunset size={22} className="text-navy-600" />,
    };
  return {
    text: "Good evening",
    icon: <Moon size={22} className="text-navy-600" />,
  };
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  const greeting = useMemo(() => getGreeting(), []);

  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : "Member";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="mb-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div>
        <div className="flex items-center gap-2 mb-1">
          {greeting.icon}
          <h1 className="text-2xl font-bold text-navy-800">
            {greeting.text}, {displayName}!
          </h1>
        </div>
        <p className="text-sm text-mist-600">{today}</p>
      </div>
      <div className="flex items-center gap-2 bg-white border border-mist-300 rounded-xl px-4 py-2 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-navy-600 animate-pulse" />
        <span className="text-sm text-navy-700 font-medium">Online</span>
      </div>
    </div>
  );
};

export default DashboardHeader;
