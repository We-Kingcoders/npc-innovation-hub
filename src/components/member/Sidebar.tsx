import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Bell,
  FolderOpen,
  Briefcase,
  MessageSquare,
  Calendar,
  LogOut,
  User,
} from "lucide-react";

interface SidebarItem {
  name: string;
  icon: React.ReactNode;
  link: string;
  badge?: number;
  color: string;
}

const sidebarItems: SidebarItem[] = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    link: "/dashboard",
    color: "bg-[#9B5CFF]",
  },
  {
    name: "Notifications",
    icon: <Bell size={20} />,
    link: "/notifications",
    badge: 6,
    color: "bg-[#FF4D4D]",
  },
  {
    name: "Resources",
    icon: <FolderOpen size={20} />,
    link: "/dashboard/resources",
    badge: 5,
    color: "bg-[#38D9A9]",
  },
  {
    name: "Projects",
    icon: <Briefcase size={20} />,
    link: "/dashboard/projects",
    badge: 30,
    color: "bg-[#A5B4FC]",
  },
  {
    name: "Messages",
    icon: <MessageSquare size={20} />,
    link: "/hub-channel",
    color: "bg-[#38D9A9]",
  },
  {
    name: "Events",
    icon: <Calendar size={20} />,
    link: "/dashboard/events",
    badge: 6,
    color: "bg-[#38D9A9]",
  },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 ml-6 rounded-md bg-[#0C2340] min-h-screen flex flex-col justify-between py-8 px-6 text-white shadow-xl">
      <div>
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-full bg-[#9B5CFF] mb-2 flex items-center justify-center">
            <User size={32} className="text-white" />
          </div>
          <span className="text-xl font-semibold">SAM</span>
        </div>

        {/* Menu Section */}
        <div className="mb-6 ml-2 text-sm opacity-70 uppercase tracking-wide font-medium">
          Menu
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {sidebarItems.map((item) => (
            <NavLink
              to={item.link}
              key={item.name}
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-[#122e4a] font-medium shadow-md border-l-4 border-[#9B5CFF]"
                    : "hover:bg-[#122e4a] hover:shadow-sm"
                }`
              }
            >
              <span
                className={`${item.color} text-white rounded-lg p-2 relative`}
              >
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </span>
              <span className="flex-1">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <button className="flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 hover:bg-red-600 hover:shadow-md font-medium text-red-400 hover:text-white mt-10">
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  );
};
