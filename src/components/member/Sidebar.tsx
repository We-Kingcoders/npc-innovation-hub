import React from "react";
import { NavLink } from "react-router-dom";

interface SidebarItem {
  name: string;
  icon: React.ReactNode;
  link: string;
  badge?: number;
}

const sidebarItems: SidebarItem[] = [
  {
    name: "Dashboard",
    icon: (
      <span className="bg-[#9B5CFF] text-white rounded-lg p-2">
        <svg width="20" height="20" fill="none">
          <rect width="20" height="20" rx="6" fill="currentColor" />
        </svg>
      </span>
    ),
    link: "/dashboard",
  },
  {
    name: "Notification",
    icon: (
      <span className="bg-[#FF4D4D] text-white rounded-lg p-2 relative">
        <svg width="20" height="20" fill="none">
          <rect width="20" height="20" rx="6" fill="currentColor" />
        </svg>
        <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
          6
        </span>
      </span>
    ),
    link: "/notifications",
    badge: 6,
  },
  {
    name: "Resources",
    icon: (
      <span className="bg-[#38D9A9] text-white rounded-lg p-2 relative">
        <svg width="20" height="20" fill="none">
          <rect width="20" height="20" rx="6" fill="currentColor" />
        </svg>
        <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
          5
        </span>
      </span>
    ),
    link: "/dashboard/resources",
    badge: 5,
  },
  {
    name: "Projects",
    icon: (
      <span className="bg-[#A5B4FC] text-white rounded-lg p-2 relative">
        <svg width="20" height="20" fill="none">
          <rect width="20" height="20" rx="6" fill="currentColor" />
        </svg>
        <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
          30
        </span>
      </span>
    ),
    link: "/dashboard/projects",
    badge: 30,
  },
  {
    name: "Messages",
    icon: (
      <span className="bg-[#38D9A9] text-white rounded-lg p-2">
        <svg width="20" height="20" fill="none">
          <rect width="20" height="20" rx="6" fill="currentColor" />
        </svg>
      </span>
    ),
    link: "/dashboard/messages",
  },
  {
    name: "Events",
    icon: (
      <span className="bg-[#38D9A9] text-white rounded-lg p-2 relative">
        <svg width="20" height="20" fill="none">
          <rect width="20" height="20" rx="6" fill="currentColor" />
        </svg>
        <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
          6
        </span>
      </span>
    ),
    link: "/dashboard/events",
    badge: 6,
  },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 ml-6 rounded-md bg-[#0C2340] min-h-screen flex flex-col justify-between py-8 px-6 text-white shadow-xl">
      <div>
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-full bg-[#9B5CFF] mb-2" />
          <span className="text-xl font-semibold">SAM</span>
        </div>
        <div className="mb-6 ml-2 text-sm opacity-70">Menu</div>
        <nav className="flex flex-col gap-2">
          {sidebarItems.map((item) => (
            <NavLink
              to={item.link}
              key={item.name}
              className={({ isActive }) =>
                `flex items-center gap-3 py-2 px-4 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#122e4a] font-bold underline"
                    : "hover:bg-[#122e4a]"
                }`
              }
            >
              <span className="relative">{item.icon}</span>
              <span>{item.name}</span>
              {item.badge && (
                <span className="ml-auto text-xs bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
      <button className="font-bold text-lg mt-10">LOGOUT</button>
    </aside>
  );
};
